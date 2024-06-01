import { verifyToken } from "@/utils/fuc/tokenJwt";
import dbConnect from "@/utils/mongodb";
import User from "@/utils/schemas/User";

export async function GET(req: Request) {
  try {
    dbConnect()
    const { statusToken, payloadToken } = verifyToken()
    if (statusToken) {
      const res = await User.findById(payloadToken._id)
      return Response.json({ status: 'success', message: 'Xác thực token thành công', data: res });
    }
    return Response.json({ status: 'warning', message: 'Xác thực token không thành công' });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}