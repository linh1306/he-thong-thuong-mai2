import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  code,
  address,
  statusInvoice,
  total,
  totalDiscount,
  create_at
} = propertiesSchema

export interface IInvoiceSale {       //hóa đơn bán hàng
  _id?: ObjectId;
  _products?: ObjectId[],             //danh sách mặt hàng bán
  _user?: ObjectId,
  _discount?: ObjectId,
  code?: string,                      //mã thanh toán
  address?: string[],                 //địa chỉ giao hàng
  statusInvoice?: 'payed' | 'delivered'      //trạng thái đã thanh toán hoặc đã giao hàng
  total?: number,                     //tổng tiền
  totalDiscount?: number,             //tổng tiền giảm giá
  create_at?: Date                    //ngày tạo
}

const InvoiceSaleSchema: Schema = new Schema({
  _products: {
    type: [Schema.ObjectId],
    ref: 'ProductInvoice'
  },
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
  total,
  totalDiscount,
  create_at
});

const InvoiceSale = mongoose.models.InvoiceSale || mongoose.model<IInvoiceSale>('InvoiceSale', InvoiceSaleSchema);

export default InvoiceSale;

