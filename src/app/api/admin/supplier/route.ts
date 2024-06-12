import { objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import Supplier from "@/utils/schemas/Supplier";
import { ISupplier } from "@/utils/schemas/Supplier";
import yupValidate from "@/utils/yubConfig/yupValidate";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin' && roleUser !== 'employee') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền xem danh sách đối tác' });
    }

    const { currentPage, pageSize } = objectParamSearch(searchParams)
    const options = {}

    try {
      const res = await Supplier.find(removeEmptyFields(options))
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)

      const totalDocuments = await Supplier.countDocuments(removeEmptyFields(options))
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách nhà cung cấp',
        data: res,
        options: { pageSize, currentPage, totalDocuments },
        optionsSearch: options
      });
    } catch (error) {
      return Response.json({
        status: 'warning',
        message: 'Lấy danh sách nhà cung cấp thất bại',
        error: error,
        data: [],
        optionsSearch: options
      })
    }
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function POST(req: Request) {
  try {
    dbConnect()
    const { name, phone, address }: ISupplier = await req.json();

    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền tạo mới nhà cung cấp' });
    }

    const yup = await yupValidate({ name, phone, address })
    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const newData = {
      name,
      phone,
      address
    }

    const res = await Supplier.create(newData)
    return Response.json({ status: 'success', message: 'Tạo mới nhà cung cấp thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function PUT(req: Request) {
  try {
    dbConnect()
    const { _id, name, phone, address }: ISupplier = await req.json();

    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền tạo mới nhà cung cấp' });
    }

    const yup = await yupValidate({ name, phone, address })
    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const res = await Supplier.updateOne(
      { _id },
      {
        name,
        phone,
        address
      })
    return Response.json({ status: 'success', message: 'Tạo mới nhà cung cấp thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function DELETE(req: Request) {
  try {
    dbConnect()
    const { _id } = await req.json();

    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền xóa nhà cung cấp' });
    }

    const res = await Supplier.deleteOne({ _id })
    return Response.json({ status: 'success', message: 'Delete thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

