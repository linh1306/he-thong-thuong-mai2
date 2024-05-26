import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  quantity,
  price
} = propertiesSchema

export interface IProductInvoice {
  _id?: ObjectId;
  _product?: ObjectId,
  quantity?: number,
  price?: number
}

const ProductInvoiceSchema: Schema = new Schema({
  _product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  quantity,
  price
});

const ProductInvoice = mongoose.models.ProductInvoice || mongoose.model<IProductInvoice>('ProductInvoice', ProductInvoiceSchema);

export default ProductInvoice;

