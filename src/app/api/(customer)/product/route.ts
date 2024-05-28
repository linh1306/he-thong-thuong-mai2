import { removeEmptyFields } from "@/utils/fuc";
import dbConnect from "@/utils/mongodb";
import Product from "@/utils/schemas/Product";

interface SearchOptions {
  _category?: string | null;
  price?: { $gte: number; $lte: number } | null;
  name?: { $regex: string, $options: string } | null
}

export async function GET(req: Request) {
  try {
    dbConnect()
    const { searchParams } = new URL(req.url)
    const pageSize = parseInt(searchParams.get('pageSize') ?? '10', 10)
    const currentPage = parseInt(searchParams.get('currentPage') ?? '1', 10)
    const skip = (currentPage - 1) * pageSize;


    const options: SearchOptions = {
      _category: searchParams.get('category'),
      price: null,
      name: null
    }

    if (searchParams.get('priceMin') && searchParams.get('priceMax')) {
      options.price = { $gte: parseInt(searchParams.get('priceMin')!, 10), $lte: parseInt(searchParams.get('priceMax')!, 10) }
    }
    if (searchParams.get('searchKey')) {
      options.name = { $regex: searchParams.get('searchKey')!, $options: 'i' }
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
        }
      });
    } catch (error) {
      return Response.json({
        message: 'get', error: error, data: [], options: {
          pageSize,
          currentPage,
          totalDocuments: 0
        }
      })
    }
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}