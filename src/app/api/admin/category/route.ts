import { verifyToken } from "@/utils/fuc/tokenJwt";
import dbConnect from "@/utils/mongodb";
import Category from "@/utils/schemas/Category";
import yupValidate from "@/utils/yubConfig/yupValidate";

export async function POST(req: Request) {
  try {
    dbConnect()
    const { name, urlImage } = await req.json();
    const yup = await yupValidate({ name, urlImage })

    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const { payloadToken } = verifyToken()

    if (payloadToken?.role !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền update', data: payloadToken });
    }

    const res = await Category.create(
      { name, urlImage: urlImage ? urlImage : '/image/categories.jpg' }
    )
    return Response.json({ status: 'success', message: 'Create thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function PUT(req: Request) {
  try {
    dbConnect()
    const { _id, name, urlImage } = await req.json();
    const yup = await yupValidate({ name, urlImage })

    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const { payloadToken } = verifyToken()

    if (payloadToken?.role !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền update', data: payloadToken });
    }

    const res = await Category.updateOne(
      { _id: _id },
      { $set: { name, urlImage } }
    )
    return Response.json({ status: 'success', message: 'Update thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function DELETE(req: Request) {
  try {
    dbConnect()
    const { _id } = await req.json();
    const { payloadToken } = verifyToken()

    if (payloadToken?.role !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền delete', data: payloadToken });
    }

    const res = await Category.deleteOne({ _id })
    return Response.json({ status: 'success', message: 'Delete thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}