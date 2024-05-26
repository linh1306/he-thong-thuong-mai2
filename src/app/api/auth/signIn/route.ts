import jwt from 'jsonwebtoken';
import dbConnect from "@/utils/mongodb"
import User from "@/utils/schemas/User"
import { cookies } from 'next/headers';
import yupValidate from "@/utils/yubConfig/yupValidate"

export async function POST(req: Request) {
  await dbConnect()
  try {
    const { email, password } = await req.json();
    const cookieStore = cookies();
    const user = await User.findOne({ code: email })
    const yup = await yupValidate({ email: email, password: password })

    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    if (user?.password !== password) {
      return Response.json({ status: 'warning', message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    const accessToken = jwt.sign({
      id: user?._id,
      role: user?.role,
    }, 'my_secret_key');

    cookieStore.set('token', accessToken, { httpOnly: true, secure: true });

    return Response.json({ status: 'success', message: 'Đăng nhập thành công', data: user });
  } catch (e) {
    return Response.json({ status: 'error', message: 'Đã xảy ra lỗi, hãy thử lại sau', error: e });
  }
}