import InvoiceSale from '@/utils/schemas/InvoiceSale';
import { createId, objectParamSearch, removeEmptyFields } from "@/utils/fuc";
import getRoleWithToken from "@/utils/fuc/auth";
import dbConnect from "@/utils/mongodb";
import { ObjectId } from "mongoose";

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { _product = [], optionReport = 'month' } = await req.json();
    const { roleUser } = await getRoleWithToken();
    const now = new Date();

    if (roleUser !== 'admin') {
      return Response.json({ status: 'warning', message: 'Bạn không có quyền xem danh sách đơn hàng' });
    }

    let res: any[] = [];

    if (optionReport === 'month') {
      res = Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}` }));
      const monthlyReports = [];

      for (let i = 0; i < 12; i++) {
        const start = new Date(now.getFullYear(), i, 1);
        const end = new Date(now.getFullYear(), i + 1, 1);

        const reportProduct = await InvoiceSale.aggregate([
          {
            $match: {
              create_at: {
                $gte: start,
                $lt: end
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
            $unwind: '$products'
          },
          {
            $group: {
              _id: '$products._product',
              quantity: { $sum: '$products.quantity' },
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: '_id',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $project: {
              _id: 0,
              _product: "$_id",
              quantity: "$quantity",
              product: { $arrayElemAt: ["$product", 0] }
            }
          }
        ]);

        monthlyReports.push(reportProduct);
      }
      let index = 0
      for (const Item of res) {
        for (const nameProduct of _product) {
          const item = monthlyReports[index].find(item => item.product.name === nameProduct);
          Item[nameProduct] = item?.quantity ?? 0
        }
        index++
      }

      return Response.json({
        status: 'success',
        message: 'Dữ liệu báo cáo theo tháng',
        data: res
      });

    } else if (optionReport === 'precious') {
      res = [
        { name: 'Quý 1' },
        { name: 'Quý 2' },
        { name: 'Quý 3' },
        { name: 'Quý 4' }
      ];

      const quarterlyReports = [];

      for (let i = 0; i < 4; i++) {
        const start = new Date(now.getFullYear(), i * 3, 1);
        const end = new Date(now.getFullYear(), (i + 1) * 3, 1);

        const reportProduct = await InvoiceSale.aggregate([
          {
            $match: {
              create_at: {
                $gte: start,
                $lt: end
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
            $unwind: '$products'
          },
          {
            $group: {
              _id: '$products._product',
              quantity: { $sum: '$products.quantity' },
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: '_id',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $project: {
              _id: 0,
              _product: "$_id",
              quantity: "$quantity",
              product: { $arrayElemAt: ["$product", 0] }
            }
          }
        ]);

        quarterlyReports.push(reportProduct);
      }

      let index = 0
      for (const Item of res) {
        for (const nameProduct of _product) {
          const item = quarterlyReports[index].find(item => item.product.name === nameProduct);
          Item[nameProduct] = item?.quantity ?? 0
        }
        index++
      }

      return Response.json({
        status: 'success',
        message: 'Dữ liệu báo cáo theo quý',
        data: res,
      });

    } else if (optionReport === 'year') {
      res = Array.from({ length: 5 }, (_, i) => ({ name: String(now.getFullYear() - i) }));

      const yearlyReports = [];

      for (let i = 0; i < 5; i++) {
        const start = new Date(now.getFullYear() - i, 0, 1);
        const end = new Date(now.getFullYear() - i + 1, 0, 1);

        const reportProduct = await InvoiceSale.aggregate([
          {
            $match: {
              create_at: {
                $gte: start,
                $lt: end
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
            $unwind: '$products'
          },
          {
            $group: {
              _id: '$products._product',
              quantity: { $sum: '$products.quantity' },
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: '_id',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $project: {
              _id: 0,
              _product: "$_id",
              quantity: "$quantity",
              product: { $arrayElemAt: ["$product", 0] }
            }
          }
        ]);

        yearlyReports.push(reportProduct);
      }

      let index = 0
      for (const Item of res) {
        for (const nameProduct of _product) {
          const item = yearlyReports[index].find(item => item.product.name === nameProduct);
          Item[nameProduct] = item?.quantity ?? 0
        }
        index++
      }

      return Response.json({
        status: 'success',
        message: 'Dữ liệu báo cáo theo năm',
        data: res,
      });

    } else {
      return Response.json({
        status: 'warning',
        message: 'Trường optionReport không được để trống',
      });
    }

  } catch (error) {
    return Response.json({ message: 'get', error: error });
  }
}
