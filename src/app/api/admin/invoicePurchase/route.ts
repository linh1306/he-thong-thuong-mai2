import { objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import InvoicePurchase, { IInvoicePurchase } from "@/utils/schemas/InvoicePurchase";
import yupValidate from "@/utils/yubConfig/yupValidate";
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
    if (roleUser !== 'admin' && roleUser !== 'employee') {
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
      const res = await InvoicePurchase.find(removeEmptyFields(options))
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)

      const totalDocuments = await InvoicePurchase.countDocuments(removeEmptyFields(options))
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

