import { verifyToken } from "@/utils/fuc/tokenJwt";
import dbConnect from "@/utils/mongodb";
import Product from "@/utils/schemas/Product";
import yupValidate from "@/utils/yubConfig/yupValidate";

export async function POST(req: Request) {
  try {
    dbConnect()
    const { name, _category, price, description, urlImage, unit } = await req.json();
    const yup = await yupValidate({ name, price, description, urlImage, unit })

    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const { payloadToken } = verifyToken()

    if (payloadToken?.role !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền add', data: payloadToken });
    }

    const res = await Product.create(
      {
        name,
        _category,
        price,
        description,
        quantity: 0,
        urlImage,
        percentSale: 0,
        numberOfReviews: 0,
        sumRating: 0,
        unit
      }
    )
    return Response.json({ status: 'success', message: 'Create thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function PUT(req: Request) {
  try {
    dbConnect()
    const { _id, name, _category, price, description, urlImage, percentSale, unit } = await req.json();

    const { payloadToken } = verifyToken()

    if (payloadToken?.role !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền update', data: payloadToken });
    }

    const res = await Product.updateOne(
      { _id: _id },
      {
        $set: {
          name,
          _category,
          price,
          description,
          urlImage,
          percentSale,
          unit
        }
      }

    )
    return Response.json({ status: 'success', message: 'Create thành công', data: res });
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

    const res = await Product.deleteOne({ _id })
    return Response.json({ status: 'success', message: 'Delete thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}