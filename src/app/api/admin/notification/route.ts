import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import InvoiceSale from "@/utils/schemas/InvoiceSale";
import Notification from "@/utils/schemas/Notification";
import yupValidate from "@/utils/yubConfig/yupValidate";


export async function PUT(req: Request) {
  try {
    dbConnect()
    const { _user, code, description } = await req.json();
    const { roleUser } = await getRoleWithToken()

    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền thông báo' });
    }

    const yup = await yupValidate({ code, description })
    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const res = await Notification.create({
      _user,
      code,
      description,
      status: false,
      create_at: new Date()
    })
    return Response.json({ status: 'success', message: 'Đã thông báo đến người dùng', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
