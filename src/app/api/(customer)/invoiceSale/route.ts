import { IBodyCreateInvoiceSale } from "@/utils/api/customer/invoiceSale";
import { createId, newDate, objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import Discount from "@/utils/schemas/Discount";
import InvoiceSale, { IInvoiceSale } from "@/utils/schemas/InvoiceSale";
import ProductInvoice, { IProductInvoice } from "@/utils/schemas/ProductInvoice";
import ProductWarehouse from "@/utils/schemas/ProductWarehouse";
import yupValidate from "@/utils/yubConfig/yupValidate";
import { ObjectId } from "mongoose";

interface IGetInvoiceSale {
  _user: ObjectId
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser, idUser } = await getRoleWithToken()
    if (!roleUser) {
      return Response.json({ status: 'warning', message: 'Bạn chưa đăng nhập' });
    }

    const { currentPage, pageSize } = objectParamSearch(searchParams)
    const options: IGetInvoiceSale = {
      _user: idUser
    }

    try {
      const res = await InvoiceSale.find(options)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)

      const totalDocuments = await InvoiceSale.countDocuments(options)
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách đơn hàng',
        data: res,
        options: { pageSize, currentPage, totalDocuments },
        optionsSearch: options
      });
    } catch (error) {
      return Response.json({
        status: 'warning',
        message: 'Lấy danh sách nhà cung cấp thất bại',
        error: error,
        data: [],
        optionsSearch: options
      })
    }
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function POST(req: Request) {
  try {
    dbConnect()
    const { codeDiscount, address, _products }: IBodyCreateInvoiceSale = await req.json();
    const { roleUser, idUser } = await getRoleWithToken()

    if (!roleUser) {
      return Response.json({ status: 'warning', message: 'Bạn chưa đăng nhập' });
    }

    const yup = await yupValidate({ address })
    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }
    const discount = await Discount.findOne({ code: codeDiscount })
    let code = createId();

    const totalDiscount = discount?.value ?? 0                                         //số tiền giảm giá của thẻ giảm giá
    let totalSale = 0
    const total = _products.reduce((sum, { _product, quantity }) => {
      const price = (_product?.price ?? 0) * (100 - (_product?.percentSale ?? 0)) / 100      //giá bán
      totalSale += quantity * Math.min((_product?.price ?? 0) - price, 0)                           //số tiền giảm giá theo %
      return sum + quantity * price;
    }, 0) - totalDiscount

    let capital = 0
    const PInvoice: IProductInvoice[] = []

    for (const POrder of _products) {
      let q = POrder.quantity
      const sortedProductWarehouse = await ProductWarehouse.find({
        _product: POrder._product._id,
        isCancel: false,
        quantity: { $gt: 0 }
      }).sort({ created_at: 1 });

      for (const doc of sortedProductWarehouse) {
        capital += Math.min(q, doc.quantity) * doc.importPrice
        await ProductWarehouse.updateOne({ _id: doc._id }, { $inc: { quantity: -Math.min(q, doc.quantity) } })
        if (q <= doc.quantity) {
          doc.quantity -= q
          q = 0
          break;
        } else {
          q -= doc.quantity
          doc.quantity = 0
        }
      }
      POrder.quantity -= q
      if (POrder.quantity > 0) {
        PInvoice.push({
          _invoiceSale: null,
          _invoicePurchase: null,
          _product: POrder._product._id!,
          quantity: POrder.quantity,
          price: POrder._product.price!,
        })
      }
    }
    const newData: IInvoiceSale = {
      _user: idUser,
      _discount: discount?._id ?? null,
      code,
      address,
      statusInvoice: 'confirmed',
      revenue: total - capital,
      total,
      totalDiscount: totalDiscount + totalSale,
      create_at: newDate()
    }

    const res = await InvoiceSale.create(newData)

    const newProductInvoice = PInvoice.map(product => ({ ...product, _invoiceSale: res._id }))
    await ProductInvoice.insertMany(newProductInvoice)
    await ProductWarehouse.aggregate([
      {
        $match: {
          isCancel: false,
        }
      },
      {
        $group: {
          _id: "$_product",
          quantity: { $sum: "$quantity" }
        }
      },
      {
        $merge: {
          into: "products",
          on: "_id",
          whenMatched: "merge",
          whenNotMatched: "discard"
        }
      }
    ]).exec()

    return Response.json({ status: 'success', message: 'Tạo đơn hàng thành công', data: res, newProductInvoice });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
