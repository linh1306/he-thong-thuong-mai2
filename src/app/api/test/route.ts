import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    
    const token = cookieStore.get('token')

    return Response.json({ status: 'success', message: 'Đăng nhập thành công', data: '', token });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const { code, password } = await req.json();
    return Response.json({ message: 'post', data: code })
  } catch (error) {
    return Response.json({ message: 'post', error: error })
  }
}