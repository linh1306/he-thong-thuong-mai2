import { verifyToken } from "@/utils/fuc/tokenJwt";
import dbConnect from "@/utils/mongodb";
import User from "@/utils/schemas/User";
import yupValidate from "@/utils/yubConfig/yupValidate";

export async function GET(req: Request) {
  try {
    dbConnect()
    const { payloadToken } = verifyToken()

    if (payloadToken?.role !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền delete', data: payloadToken });
    }

    const res = await User.find({})
    return Response.json({ status: 'success', message: 'Lấy thành công danh sách người dùng', data: res });
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

