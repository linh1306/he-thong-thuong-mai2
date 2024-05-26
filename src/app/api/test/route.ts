export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const formData = await req.formData()
  const code = formData.get('code')
  const password = formData.get('password')
  const id = searchParams.get('id')
  return Response.json({ message: 'get', id: id, data: code })
}
export async function POST(req: Request) {
  try {
    const { code, password } = await req.json();
    return Response.json({ message: 'post', data: code })
  } catch (error) {
    return Response.json({ message: 'post', error: error })
  }
}