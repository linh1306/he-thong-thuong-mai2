import { IBodyUpdateStatusNotification } from "@/utils/api/customer/notification";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import Notification from "@/utils/schemas/Notification";

export async function GET(req: Request) {
  try {
    dbConnect()
    const { roleUser, idUser } = await getRoleWithToken()
    if (!roleUser) {
      return Response.json({ status: 'warning', message: 'Bạn chưa đăng nhập' });
    }

    const res = await Notification.find({ _user: idUser, status: false })

    return Response.json({
      status: 'success',
      message: 'Lấy danh sách thông báo',
      data: res,
    })

  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function POST(req: Request) {
  try {
    dbConnect()
    const { status, _id }: IBodyUpdateStatusNotification = await req.json();
    const { roleUser, idUser } = await getRoleWithToken()

    if (!roleUser) {
      return Response.json({ status: 'warning', message: 'Bạn chưa đăng nhập' });
    }

    const res = await Notification.updateOne({ _id, _user: idUser }, {
      status
    });

    return Response.json({ status: 'success', message: 'Thay đổi trạng thái thông báo', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
