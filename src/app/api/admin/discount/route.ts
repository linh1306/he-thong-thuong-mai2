import { objectParamSearch } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import Discount from "@/utils/schemas/Discount";
import yupValidate from "@/utils/yubConfig/yupValidate";

interface IOptions {
  currentPage: number,
  pageSize: number
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền lấy danh sách người dùng' })
    }

    const { currentPage, pageSize } = objectParamSearch(searchParams)

    try {
      const res = await Discount.find()
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)

      const totalDocuments = await Discount.countDocuments()
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách Mặt hàng',
        data: res,
        options: { pageSize, currentPage, totalDocuments },
      });
    } catch (error) {
      return Response.json({
        status: 'warning',
        message: 'Lấy danh sách thất bại',
        error: error,
        data: [],
      })
    }
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function PUT(req: Request) {
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền update' });
    }

    const { code, name, value, quantity } = await req.json();
    const yup = await yupValidate({ code, name, value, quantity })
    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const res = await Discount.create({ code, name, value, exp_at: new Date(), quantity })
    return Response.json({ status: 'success', message: 'Tạo mới thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
