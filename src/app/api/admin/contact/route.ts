import { objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import Contact from "@/utils/schemas/Contact";
import yupValidate from "@/utils/yubConfig/yupValidate";

interface SearchOptions {
  status?: boolean | null;
  email?: { $regex: string, $options: string } | null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền xem danh sách liên hệ' });
    }

    const { currentPage, pageSize, totalDocuments, searchKey, status, ...options } = objectParamSearch(searchParams)
    if (searchKey) {
      options.email = { $regex: searchKey, $options: 'i' }
    }
    if (status) {
      options.status = status === 'true'
    }

    try {
      const res = await Contact.find(removeEmptyFields(options))
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)

      const totalDocuments = await Contact.countDocuments(removeEmptyFields(options))
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách liên hệ',
        data: res,
        options: { pageSize, currentPage, totalDocuments },
        optionsSearch: options
      });
    } catch (error) {
      return Response.json({
        status: 'warning',
        message: 'Lấy danh sách thất bại',
        error: error,
        data: [],
        optionsSearch: options
      })
    }
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}


export async function PUT(req: Request) {
  try {
    dbConnect()
    const { _id, status } = await req.json();
    const yup = await yupValidate({ status })
    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền update' });
    }

    const res = await Contact.updateOne(
      { _id: _id },
      { $set: { status } }
    )
    return Response.json({ status: 'success', message: 'Thay đổi trạng thái thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
