import { objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import dbConnect from "@/utils/mongodb";
import Product from "@/utils/schemas/Product";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { currentPage, pageSize, totalDocuments, searchKey, sortBy, category, priceMin, priceMax, ...options } = objectParamSearch(searchParams)
    const skip = (currentPage - 1) * pageSize;

    if (searchKey) {
      options.name = { $regex: searchKey, $options: 'i' }
    }
    if (priceMin && priceMax) {
      options.price = { $gte: parseInt(priceMin) * 1000, $lte: parseInt(priceMax) * 1000 }
    }
    if (category) {
      options._category = category
    }
    try {
      const res = await Product.find(removeEmptyFields(options))
        .skip(skip)
        .limit(pageSize)
        .populate('_category')
      const totalDocuments = await Product.countDocuments(removeEmptyFields(options))
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách Mặt hàng',
        data: res,
        options: {
          pageSize,
          currentPage,
          totalDocuments
        },
        optionSearch: options
      });
    } catch (error) {
      return Response.json({
        status: 'warning',
        message: 'Lấy danh sách thất bại',
        error: error,
        data: [],
        options: options
      })
    }
  } catch (error) {
    return Response.json({ status: 'error', message: 'Đã có lỗi xảy ra vui lòng thử lại sau', error: error })
  }
}

