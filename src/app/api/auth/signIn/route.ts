import dbConnect from "@/utils/mongodb"
import User from "@/utils/schemas/User"
import { cookies } from 'next/headers';
import yupValidate from "@/utils/yubConfig/yupValidate"
import { verifyPassword } from '@/utils/fuc/hashPassword';
import { createToken } from '@/utils/fuc/tokenJwt';

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email, password } = await req.json();
    const cookieStore = cookies();
    const user = await User.findOne({ email: email })
    const yup = await yupValidate({ email: email, password: password })

    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    if (!verifyPassword(user?.password, password)) {
      return Response.json({ status: 'warning', message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    const accessToken = createToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });


    cookieStore.set('token', accessToken, { httpOnly: true, secure: true });

    return Response.json({ status: 'success', message: 'Đăng nhập thành công', data: user });
  } catch (e) {
    return Response.json({ status: 'error', message: 'Đã xảy ra lỗi, hãy thử lại sau', error: e });
  }
}