import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    cookieStore.delete('token')
    return Response.json({ status: 'success', message: 'Đăng xuất thành công' });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}