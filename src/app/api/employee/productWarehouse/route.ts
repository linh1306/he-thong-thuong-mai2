import { objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import ProductInvoice, { IProductInvoice } from "@/utils/schemas/ProductInvoice";
import ProductWarehouse, { IProductWarehouse } from "@/utils/schemas/ProductWarehouse";
import { ObjectId } from "mongoose";

interface IGetProductWarehouse {
  _product?: ObjectId;
  _supplier?: ObjectId
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'employee'&& roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền xem danh sách mặt hàng trong kho' });
    }

    const { _product, currentPage, pageSize } = objectParamSearch(searchParams)
    const options: IGetProductWarehouse = {}
    if (_product) {
      options._product = _product
    }

    try {
      const res = await ProductWarehouse.find(removeEmptyFields(options))
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .populate('_product')

      const totalDocuments = await ProductWarehouse.countDocuments(removeEmptyFields(options))
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách mặt hàng trong kho thành công',
        data: res,
        options: { pageSize, currentPage, totalDocuments },
        optionsSearch: options
      });
    } catch (error) {
      return Response.json({
        status: 'warning',
        message: 'Lấy danh sách mặt hàng trong kho thất bại',
        error: error,
        data: [],
        optionsSearch: options
      })
    }
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
