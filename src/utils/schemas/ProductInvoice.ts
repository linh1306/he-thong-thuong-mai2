import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'
import { IInvoiceSale } from './InvoiceSale';
import { IInvoicePurchase } from './InvoicePurchase';
import { IProduct } from './Product';

const {
  quantity,
  price
} = propertiesSchema

export interface IProductInvoice {  //Mặt hàng trong hóa đơn
  _id?: string,
  _invoiceSale?: IInvoiceSale | string | null,
  _invoicePurchase?: IInvoicePurchase | string | null,
  _product?: IProduct | string,
  quantity?: number,
  price?: number,
}

const ProductInvoiceSchema: Schema = new Schema({
  _invoiceSale: {
    type: Schema.ObjectId,
    ref: 'InvoiceSale'
  },
  _invoicePurchase: {
    type: Schema.ObjectId,
    ref: 'InvoicePurchase'
  },
  _product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  quantity,
  price,
});


const ProductInvoice = mongoose.models.ProductInvoice || mongoose.model<IProductInvoice>('ProductInvoice', ProductInvoiceSchema);

export default ProductInvoice;

