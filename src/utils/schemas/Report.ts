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
  year?: number,
  reportProducts?: {
    _product: IProduct | string,                     //id sản phẩm
    quantity: number
  }[],
  reportUsers?: {
    _user: IUser | string,
    revenue: number,                      //doanh thu
  }[],
  revenues?: number,                      //Tổng doanh thu trong tháng
  oderCancelled?: number,                  //số đơn hàng đã hủy
  oderPayed?:number
  oderDelivered?: number,                  //số đơn hàng đã giao hàng
  oderTotal?: number,                      //tổng số đơn hàng
  total?: number,
  discount?: number
}

const reportSchema: Schema = new Schema({
  create_at
});

const Report = mongoose.models.Report || mongoose.model<IReport>('Report', reportSchema);

export default Report;

