import dbConnect from "@/utils/mongodb";
import Category from "@/utils/schemas/Category";

export async function GET(req: Request) {
  try {
    dbConnect()
    const res = await Category.find({})
    return Response.json({ status: 'success', message: 'Lấy danh sách loại mặt hàng', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}