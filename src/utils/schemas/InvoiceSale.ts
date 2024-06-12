import mongoose, { Schema } from 'mongoose';
import propertiesSchema from './index'
import { IDiscount } from './Discount';
import { IUser } from './User';

const {
  code,
  address,
  statusInvoice,
  total,
  totalDiscount,
  revenue,
  create_at
} = propertiesSchema

export interface IInvoiceSale {       //hóa đơn bán hàng
  _id?: string;
  _user?: IUser | string,
  _discount?: IDiscount | string,
  code?: string,                      //mã thanh toán
  address?: string[],                 //địa chỉ giao hàng
  statusInvoice?: 'confirmed' | 'payed' | 'success' | 'cancelled'      //trạng thái
  revenue?: number,                   //lãi của hóa đơn
  total?: number,                     //tổng tiền
  totalDiscount?: number,             //tổng tiền giảm giá
  create_at?: Date                    //ngày tạo
}

export const InvoiceSaleSchema: Schema = new Schema({
  _discount: {
    type: Schema.ObjectId,
    ref: 'Discount'
  },
  _user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  code,
  address,
  statusInvoice,
  revenue,
  total,
  totalDiscount,
  create_at
});

const InvoiceSale = mongoose.models.InvoiceSale || mongoose.model<IInvoiceSale>('InvoiceSale', InvoiceSaleSchema);

export default InvoiceSale;

