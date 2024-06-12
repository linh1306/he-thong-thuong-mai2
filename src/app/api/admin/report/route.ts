import InvoiceSale from '@/utils/schemas/InvoiceSale';
import { createId, objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import Discount from "@/utils/schemas/Discount";
import Report, { IReport } from "@/utils/schemas/Report";
import yupValidate from "@/utils/yubConfig/yupValidate";
import { ObjectId } from "mongoose";

interface IGetReport {
  month?: number;
  precious?: number;
  year: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    dbConnect()
    const { roleUser } = await getRoleWithToken()
    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền xem danh sách đơn hàng' });
    }

    const { month, precious, year, isNewData } = objectParamSearch(searchParams)

    if (!year) {
      return Response.json({ status: 'warning', message: 'Trường year không được để trống' });
    }

    const options: IGetReport = {
      year: parseInt(year)
    }
    if (month) {
      options.month = parseInt(month)
    }
    if (precious) {
      options.precious = parseInt(precious)
    }

    if (isNewData === 'true') {
      if (!year || !month || !precious) {
        return Response.json({ status: 'warning', message: 'Trường year, prectious, month không được để trống' });
      }

      const res: IReport = {
        month: parseInt(month),
        precious: parseInt(precious),
        year: parseInt(year),
        reportProducts: [],
        reportUsers: [],
        revenues: 0,
        quantitySold: 0,
        oderCancelled: 0,
        oderDelivered: 0,
        oderTotal: 0
      }

      const invoiceSaleOfMonth = await InvoiceSale.aggregate([
        {
          $match: {
            create_at: {
              $gte: new Date(`${options.year}-${options.month}-01`),
              $lt: new Date(`${options.year}-${options.month! + 1}-01`)
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
      ]);



    }
    const Reports = await Report.find(options)



    return Response.json({
      status: 'success',
      message: 'Lấy danh sách đơn hàng nhập',
      data: [],
    });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}

export async function PUT(req: Request) {
  try {
    dbConnect()
    const { _user, statusInvoice } = await req.json();
    const { roleUser } = await getRoleWithToken()

    if (roleUser !== 'admin' && roleUser !== 'employee') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền thay đổi trạng thái đơn hàng' });
    }

    const yup = await yupValidate({ statusInvoice })
    if (!yup.valid) {
      return Response.json({ status: 'warning', message: 'Các trường dữ liệu không đúng yêu cầu', error: yup.invalidFields });
    }

    const res = await Report.updateOne({ _id: _user }, { statusInvoice })
    return Response.json({ status: 'success', message: 'Cập nhật trạng thái đơn hàng thành công', data: res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}
