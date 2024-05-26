import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  quantity,
  price,
  create_at,
  exp_at
} = propertiesSchema

export interface IProductWarehouse {
  _id?: ObjectId;
  _product?: ObjectId,
  quantity?: number,                //mặt hàng còn trong kho
  price?: number,                   //giá nhập
  create_at?: Date,                 //ngày nhập
  exp_at?: Date
}

const ProductWarehouseSchema: Schema = new Schema({
  _product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  quantity,
  price,
  create_at,
  exp_at
});

const ProductWarehouse = mongoose.models.ProductWarehouse || mongoose.model<IProductWarehouse>('ProductWarehouse', ProductWarehouseSchema);

export default ProductWarehouse;

