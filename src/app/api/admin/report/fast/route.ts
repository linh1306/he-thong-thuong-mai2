import InvoiceSale from '@/utils/schemas/InvoiceSale';
import { createId, objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import Discount from "@/utils/schemas/Discount";
import Report, { IReport } from "@/utils/schemas/Report";
import yupValidate from "@/utils/yubConfig/yupValidate";
import { ObjectId } from "mongoose";
import ProductInvoice from '@/utils/schemas/ProductInvoice';

interface IGetReport {
  start: Date,
  end: Date
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền xem danh sách đơn hàng' });
    }

    const { start, end } = objectParamSearch(searchParams)

    const options: IGetReport = {
      start: new Date(start),
      end: end ? new Date(end) : new Date()
    }


    const res: IReport = {
      reportProducts: [],
      reportUsers: [],
    }

    const reportProduct = await InvoiceSale.aggregate([
      {
        $match: {
          create_at: {
            $gte: options.start,
            $lt: options.end
          },
        }
      },
      {
        $lookup: {
          from: 'productinvoices',
          localField: '_id',
          foreignField: '_invoiceSale',
          as: 'products'
        }
      },
      {
        $group: {
          _id: null,
          products: { $push: '$products' }
        }
      },
      {
        $project: {
          _id: 1,
          allValues: {
            $reduce: {
              input: "$products",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          }
        }
      },
      {
        $unwind: "$allValues"
      },
      {
        $group: {
          _id: '$allValues._product',
          quantity: { $sum: 1 },
        }
      },
      {
        $lookup: {
          from: 'invoicesales',
          localField: '_id',
          foreignField: '_invoiceSale',
          as: 'products'
        }
      },
      {
        $project: {
          _id: 0,
          _product: "$_id",
          quantity: "$quantity"
        }
      },
      {
        $lookup:{
          from: 'products',
          localField: '_product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $sort: { quantity: -1 } }
    ]).limit(5)

    res.reportProducts = reportProduct

    const reportUser = await InvoiceSale.aggregate([
      {
        $match: {
          create_at: {
            $gte: options.start,
            $lt: options.end
          },
        }
      },
      {
        $group: {
          _id: '$_user',
          revenue: { $sum: '$revenue' }
        }
      },
      {
        $project: {
          _id: 0,
          _user: "$_id",
          revenue: "$revenue"
        }
      },
      {
        $lookup:{
          from: 'users',
          localField: '_user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $sort: { revenue: -1 } }
    ]).limit(5)

    res.reportUsers = reportUser

    return Response.json({
      status: 'success',
      message: 'Báo cáo mới nhất thành công',
      data: res,
      options
    });

  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
