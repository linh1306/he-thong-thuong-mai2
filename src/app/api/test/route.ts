import dbConnect from "@/utils/mongodb";
import InvoiceSale from "@/utils/schemas/InvoiceSale";
import Product from "@/utils/schemas/Product";
import ProductWarehouse from "@/utils/schemas/ProductWarehouse";
import User from "@/utils/schemas/User";
import mongoose from "mongoose";
import { Query } from "mongoose";

export async function GET(req: Request) {
  try {
    dbConnect()

    const res = await ProductWarehouse.aggregate([
      {
        $match: {
          isCancel: false,
        }
      },
      {
        $group: {
          _id: "$_product",
          quantity: { $sum: "$quantity" }
        }
      },
      {
        $merge: {
          into: "products",
          on: "_id",
          whenMatched: "merge",
          whenNotMatched: "discard"
        }
      }
    ]).exec()


    // const orders = [
    //   { _id: "665a88ce4fcea2d333ca097b", quantity: 50 },
    //   { _id: "665a896c4fcea2d333ca0984", quantity: 300 }
    // ];
    // const ids: any = orders.map(order => order._id);

    // let total: 0
    // const sortedProductWarehouse = await ProductWarehouse.find({
    //   _product: { $in: ids },
    //   isCancel: false,
    //   quantity: { $gt: 0 }
    // }).sort({ created_at: 1 });

    // for (const POrder of orders) {
    //   let q = POrder.quantity
    //   for (const doc of sortedProductWarehouse) {
    //     if (doc._product == POrder._id) {
    //       if (q <= doc.quantity) {
    //         doc.quantity -= q
    //         q = 0
    //         break;
    //       } else {
    //         q -= doc.quantity
    //         doc.quantity = 0
    //       }
    //     }
    //   }
    //   POrder.quantity -= q
    // }


    // const res = await User.aggregate([
    //   {
    //     $match: {
    //       name:{$regex:'lin', $options:'i'}
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'invoicesales',
    //       localField: '_id',
    //       foreignField: '_user',
    //       as: 'sd'
    //     }
    //   }
    // ])

    return Response.json({ status: 'success', message: 'Đăng nhập thành công', res });
  } catch (error) {
    return Response.json({ message: 'get', error: error })
  }
}