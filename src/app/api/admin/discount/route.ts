import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import Discount from "@/utils/schemas/Discount";
import yupValidate from "@/utils/yubConfig/yupValidate";

export async function POST(req: Request) {
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền update' });
    }

    const { code, name, value, exp_at, quantity } = await req.json();
    const yup = await yupValidate({ code, name, value, exp_at, quantity })
    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const res = await Discount.create({ code, name, value, exp_at, quantity })
    return Response.json({ status: 'success', message: 'Thay đổi trạng thái thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
