import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  total,
  create_at
} = propertiesSchema

export interface IInvoicePurchase {       //hóa đơn nhập hàng
  _id?: ObjectId;
  _products?: ObjectId[],
  _supplier?: ObjectId,
  total?: number,
  create_at?: Date
}

const InvoicePurchaseSchema: Schema = new Schema({
  _products: {
    type: [Schema.ObjectId],
    ref: 'ProductInvoice'
  },
  _supplier: {
    type: Schema.ObjectId,
    ref: 'Supplier'
  },
  total,
  create_at
});

const InvoicePurchase = mongoose.models.InvoicePurchase || mongoose.model<IInvoicePurchase>('InvoicePurchase', InvoicePurchaseSchema);

export default InvoicePurchase;

