import { IPostInvoicePurchaseBody } from "@/utils/api/employee/invoicePurchase";
import { newDate, objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import InvoicePurchase from "@/utils/schemas/InvoicePurchase";
import ProductInvoice, { IProductInvoice } from "@/utils/schemas/ProductInvoice";
import ProductWarehouse, { IProductWarehouse } from "@/utils/schemas/ProductWarehouse";
import { ObjectId } from "mongoose";

interface IGetInvoicePurchase {
  _products?: ObjectId;
  _supplier?: ObjectId
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'employee' && roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền xem danh sách đơn hàng nhập' });
    }

    const { _products, _supplier, currentPage, pageSize } = objectParamSearch(searchParams)
    const options: IGetInvoicePurchase = {}
    if (_products) {
      options._products = _products
    }
    if (_supplier) {
      options._supplier = _supplier
    }
    try {
      const res = await InvoicePurchase.find(options)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .populate('_supplier')

      const totalDocuments = await InvoicePurchase.countDocuments(options)
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách đơn hàng nhập',
        data: res,
        options: { pageSize, currentPage, totalDocuments },
        optionsSearch: options
      });
    } catch (error) {
      return Response.json({
        status: 'warning',
        message: 'Lấy danh sách đơn hàng nhập thất bại',
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
    const { _products, _supplier }: IPostInvoicePurchaseBody = await req.json();

    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'employee' && roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền tạo mới đơn nhập' });
    }

    const total = _products.reduce((sum, product) => {
      return sum + (product?.price ?? 0) * (product?.quantity ?? 0);
    }, 0);

    const create_at = newDate()

    const res = await InvoicePurchase.create({
      _supplier: _supplier,
      total,
      create_at
    })

    const newProductInvoice: IProductInvoice[] = []
    const newProductWarehouse: IProductWarehouse[] = []

    _products.forEach((product) => {
      newProductInvoice.push({
        _invoiceSale: null,
        _invoicePurchase: res._id,
        _product: product._id!,
        quantity: product.quantity,
        price: product.price,
      })
      newProductWarehouse.push({
        _product: product._id!,
        quantity: product.quantity,
        importPrice: product.price,
        create_at,
        exp_at: product.exp_at
      })
    });

    await ProductInvoice.insertMany(newProductInvoice)
    await ProductWarehouse.insertMany(newProductWarehouse)

    await ProductWarehouse.aggregate([
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

    return Response.json({ status: 'success', message: 'Tạo đơn nhập hàng thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
