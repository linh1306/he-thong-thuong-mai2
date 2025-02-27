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
      revenues: 0,
      oderCancelled: 0,
      oderPayed: 0,
      oderDelivered: 0,
      oderTotal: 0,
      total: 0,
      discount: 0,
    }

    const invoiceSaleOfMonth = await InvoiceSale.aggregate([
      {
        $match: {
          create_at: {
            $gte: options.start,
            $lt: options.end
          }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$revenue' },
          total: { $sum: '$total' },
          totalDiscount: { $sum: '$totalDiscount' },
        }
      },
      {
        $limit: 1
      }
    ])
    if (invoiceSaleOfMonth.length == 0) {
      return Response.json({
        status: 'success',
        message: 'Lấy danh sách đơn hàng nhập mới nhất',
        data: res,
        options
      });
    }

    const revenue = invoiceSaleOfMonth[0]

    res.revenues = revenue.revenue
    res.total = revenue.total
    res.discount = revenue.totalDiscount

    const statusInvoices = await InvoiceSale.aggregate([
      {
        $match: {
          create_at: {
            $gte: options.start,
            $lt: options.end
          }
        }
      },
      {
        $group: {
          _id: "$statusInvoice",
          count: { $sum: 1 }
        }
      }
    ])
    const objStatusInvoices = await statusInvoices.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.oderCancelled = objStatusInvoices.cancelled ?? 0
    res.oderDelivered = objStatusInvoices.success ?? 0
    res.oderPayed = objStatusInvoices.payed ?? 0
    res.oderTotal = (objStatusInvoices.confirmed ?? 0) + (objStatusInvoices.payed ?? 0) + (objStatusInvoices.success ?? 0) + (objStatusInvoices.cancelled ?? 0)

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
      }
    ])

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
      { $sort: { revenue: -1 } }
    ])

    res.reportUsers = reportUser

    return Response.json({
      status: 'success',
      message: 'Lấy danh sách đơn hàng nhập mới nhất',
      data: res,
      options
    });

  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
