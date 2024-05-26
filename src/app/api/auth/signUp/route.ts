import dbConnect from "@/utils/mongodb"
import User, { IUser } from "@/utils/schemas/User"
import bcrypt from 'bcrypt';
import yupValidate from "@/utils/yubConfig/yupValidate"

export async function POST(req: Request) {
  await dbConnect()
  try {
    const { name, email, password, address, phone } = await req.json();
    return Response.json({ status: 'success', message: 'Đăng ký tài khoản thành công', data: { name, email, password, address, phone } });
    const user = await User.findOne({ email: email })

    const yup = await yupValidate({ name, email, password, address, phone })

    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    if (user) {
      return Response.json({ status: 'warning', message: 'Email đã được đăng ký' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = {
      name,
      email,
      password:hashedPassword,
      address,
      phone,
      create_at: new Date(),
      role: 'customer',
      urlImage: '/image/user.png',
    }
    await User.create(newUser);

    return Response.json({ status: 'success', message: 'Đăng ký tài khoản thành công', data: user });
  } catch (e) {
    return Response.json({ status: 'error', message: 'Đã xảy ra lỗi, hãy thử lại sau', error: e });
  }
}