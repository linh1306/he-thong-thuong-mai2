import dbConnect from "@/utils/mongodb"
import User, { IUser } from "@/utils/schemas/User"
import bcrypt from 'bcrypt';
import yupValidate from "@/utils/yubConfig/yupValidate"
import { hashPassword } from "@/utils/fuc/hashPassword";
import { newDate } from "@/utils/fuc";

export async function POST(req: Request) {
  await dbConnect()
  try {
    const { name, email, password, address, phone } = await req.json();
    const user = await User.findOne({ email: email })

    const yup = await yupValidate({ name, email, password, address, phone })

    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    if (user) {
      return Response.json({ status: 'warning', message: 'Email đã được đăng ký' });
    }

    const hashedPassword = hashPassword(password)

    const newUser: IUser = {
      name,
      email,
      password:hashedPassword,
      address,
      phone,
      create_at: newDate(),
      role: 'customer',
      urlImage: '/image/user.png',
    }
    await User.create(newUser);

    return Response.json({ status: 'success', message: 'Đăng ký tài khoản thành công', data: user });
  } catch (e) {
    return Response.json({ status: 'error', message: 'Đã xảy ra lỗi, hãy thử lại sau', error: e });
  }
}