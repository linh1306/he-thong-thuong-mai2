import { objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import { verifyToken } from "@/utils/fuc/tokenJwt";
import dbConnect from "@/utils/mongodb";
import User from "@/utils/schemas/User";
import yupValidate from "@/utils/yubConfig/yupValidate";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền lấy danh sách người dùng' })
    }

    const { currentPage, pageSize, totalDocuments, searchKey, ...options } = objectParamSearch(searchParams)
    if (searchKey) {
      options.name = { $regex: searchKey, $options: 'i' }
    }

    try {
      const res = await User.find(removeEmptyFields(options))
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)

      const totalDocuments = await User.countDocuments(removeEmptyFields(options))
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách Mặt hàng',
        data: res,
        options: { pageSize, currentPage, totalDocuments },
        optionsSearch: options
      });
    } catch (error) {
      return Response.json({
        status: 'warning',
        message: 'Lấy danh sách thất bại',
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
    const { _id, role } = await req.json();
    const yup = await yupValidate({ role })

    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const { payloadToken } = verifyToken()

    if (payloadToken?.role !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không thể thay đổi quyền của người dùng vì bạn không phải admin', data: payloadToken });
    }

    const res = await User.updateOne(
      { _id: _id },
      {
        $set: {
          role
        }
      }

    )
    return Response.json({ status: 'success', message: 'Thay đổi quyền thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

