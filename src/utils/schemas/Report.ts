import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'
import { IProduct } from './Product';
import { IUser } from './User';

const {
  code,
  address,
  statusInvoice,
  total,
  totalDiscount,
  create_at
} = propertiesSchema

export interface IReport {       //hóa đơn bán hàng
  _id?: string;
  month: number,
  precious: number,
  year: number,
  reportProducts: {
    _product: IProduct | string,                     //id sản phẩm
    revenue: number,                      //doanh thu
    purchase: number,                     //chi phí mua
    quantitySold: number,                 //số lượng bán ra
    quantityBuy: number,                  //số lượng mua vào
    quantityInventory: number,             //số lượng hàng hỏng
    totalDiscount: number,                 //tổng tiền giảm giá áp dụng cho sản phẩm
    view: number,                          //số lượt xem
  }[],
  reportUsers: {
    _user: IUser | string,
    revenue: number,                      //doanh thu
    _products: {                          //danh sách sản phẩm mua nhiều nhất
      _product: IProduct | string,
      quantity: number
    }[]
  }[],
  revenues: number,                      //Tổng doanh thu trong tháng
  quantitySold: number,                   //tổng số lượng sản phẩm bán ra
  oderCancelled: number,                  //số đơn hàng đã hủy
  oderDelivered: number,                  //số đơn hàng đã giao hàng
  oderTotal: number,                      //tổng số đơn hàng
}

const reportSchema: Schema = new Schema({
  create_at
});

const Report = mongoose.models.Report || mongoose.model<IReport>('Report', reportSchema);

export default Report;

