import dbConnect from "@/utils/mongodb"
import User from "@/utils/schemas/User"
import yupValidate from "@/utils/yubConfig/yupValidate"
import { verifyToken } from '@/utils/fuc/tokenJwt'
import Contact from "@/utils/schemas/Contact"

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { name, email, phone, description } = await req.json();
    const yup = await yupValidate({ name, email, phone, description })

    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const { payloadToken } = verifyToken()

    const user = await User.findOne({ email: email })
    if (user && payloadToken?.email !== email) {
      return Response.json({ status: 'warning', message: 'Email đã được đăng ký, vui lòng đăng nhập bằng email' });
    }

    const contact = await Contact.create({ name, email, phone, description, status: false })

    return Response.json({ status: 'success', message: 'Đã lưu liên hệ', data: contact });
  } catch (e) {
    return Response.json({ status: 'error', message: 'Đã xảy ra lỗi, hãy thử lại sau', error: e });
  }
}