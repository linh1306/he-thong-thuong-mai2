import { IGetInvoiceSaleParams, IPutInvoiceSaleBody } from "@/utils/api/employee/invoiceSale";
import { newDate, objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import InvoiceSale from "@/utils/schemas/InvoiceSale";
import ProductInvoice, { IProductInvoice } from "@/utils/schemas/ProductInvoice";
import ProductWarehouse, { IProductWarehouse } from "@/utils/schemas/ProductWarehouse";
import { ObjectId } from "mongoose";

interface IGetInvoiceSale {
  name?: any
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'employee' && roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền xem danh sách đơn hàng bán' });
    }

    const { searchKey, currentPage, pageSize } = objectParamSearch(searchParams)
    const options: IGetInvoiceSale = {}
    if (searchKey) {
      options.name = { $regex: searchKey, $options: 'i' }
    }
    try {
      const res = await InvoiceSale.find(options)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .populate('_user')

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
        message: 'Lấy danh sách đơn hàng thất bại',
        error: error,
        data: [],
        optionsSearch: options
      })
    }
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function PUT(req: Request) {
  try {
    dbConnect()
    const { _id, statusInvoice }: IPutInvoiceSaleBody = await req.json();

    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'employee' && roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền thay đổi trạng thái đơn hàng' });
    }

    const res = await InvoiceSale.updateOne(
      { _id },
      { statusInvoice }
    )
    return Response.json({ status: 'success', message: 'Cập nhật trạng thái thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
