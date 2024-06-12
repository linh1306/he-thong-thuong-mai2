import { objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import dbConnect from "@/utils/mongodb";
import Product from "@/utils/schemas/Product";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { _product } = objectParamSearch(searchParams)

    const res = await Product.findById(_product)
      .populate('_category')
    if (res) {
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách Mặt hàng',
        data: res,
      });
    }
    return Response.json({
      status: 'warning',
      message: 'Không tìm thấy mặt hàng',
      data: res,
    });
  } catch (error) {
    return Response.json({ status: 'error', message: 'Đã có lỗi xảy ra vui lòng thử lại sau', error: error })
  }
}

