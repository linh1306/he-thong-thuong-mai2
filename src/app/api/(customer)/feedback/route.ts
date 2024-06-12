import { objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import Feedback from "@/utils/schemas/Feedback";
import Product from "@/utils/schemas/Product";
import yupValidate from "@/utils/yubConfig/yupValidate";
import { ObjectId } from "mongoose";

interface IOptionsGet {
  _product?: ObjectId
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const options: IOptionsGet = {}
  try {
    dbConnect()
    const { _product, currentPage, pageSize } = objectParamSearch(searchParams)
    const skip = (currentPage - 1) * pageSize;

    if (_product) {
      options._product = _product
    }

    try {
      const res = await Feedback.find(options)
        .skip(skip)
        .limit(pageSize)
        .populate('_feedback')

      return Response.json({
        status: 'success',
        message: 'Lấy danh sách đánh giá thành công',
        data: res,
        options: {
          pageSize,
          currentPage
        },
        optionSearch: options
      });
    } catch (error) {
      return Response.json({
        status: 'warning',
        message: 'Lấy danh sách đánh giá thất bại thất bại',
        error: error,
        data: [],
        options: options
      })
    }
  } catch (error) {
    return Response.json({ status: 'error', message: 'Đã có lỗi xảy ra vui lòng thử lại sau', error: error })
  }
}

export async function POST(req: Request) {
  try {
    dbConnect()
    const { roleUser, idUser } = await getRoleWithToken()
    if (roleUser === undefined) {
      return Response.json({ status: 'warning', message: 'Bạn chưa đăng nhập' });
    }
    const { _product, _feedback, description, rate, create_at } = await req.json();

    if (_feedback && !roleUser.include(['admin', 'employee'])) {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền phản hồi đánh giá của người dùng' });
    }
    const yup = await yupValidate({ description, rate, create_at })
    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }
    if (rate > 0) {
      await Product.updateOne(
        { _id: _product },
        { $inc: { numberOfReviews: 1, sumRating: rate } }
      )
    }
    const res = await Feedback.create({ _user: idUser, _product, _feedback: _feedback ?? null, description, rate, create_at })
    return Response.json({ status: 'success', message: 'Đánh giá thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'error', error: error })
  }
}
