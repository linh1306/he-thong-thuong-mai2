import mongoose, { Schema } from 'mongoose';
import propertiesSchema from './index'
import { ISupplier } from './Supplier';

const {
  total,
  create_at
} = propertiesSchema

export interface IInvoicePurchase {       //hóa đơn nhập hàng
  _id?: string;
  _supplier?: ISupplier | string,
  total?: number,
  create_at?: Date
}

export const InvoicePurchaseSchema: Schema = new Schema({
  _supplier: {
    type: Schema.ObjectId,
    ref: 'Supplier'
  },
  total,
  create_at
});

const InvoicePurchase = mongoose.models.InvoicePurchase || mongoose.model<IInvoicePurchase>('InvoicePurchase', InvoicePurchaseSchema);

export default InvoicePurchase;

