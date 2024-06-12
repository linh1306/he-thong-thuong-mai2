import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'
import { IProduct } from './Product';

const {
  quantity,
  importPrice,
  isCancel,
  create_at,
  exp_at
} = propertiesSchema

export interface IProductWarehouse {        //Mặt hàng trong kho
  _id?: string;
  _product?: IProduct | string,
  quantity?: number,                //mặt hàng còn trong kho
  importPrice?: number,             //giá nhập
  create_at?: Date,                 //ngày nhập
  isCancel?: boolean,
  exp_at?: Date                     //ngày hết hạn
}

const ProductWarehouseSchema: Schema = new Schema({
  _product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  quantity,
  importPrice,
  isCancel,
  create_at,
  exp_at
});

const ProductWarehouse = mongoose.models.ProductWarehouse || mongoose.model<IProductWarehouse>('ProductWarehouse', ProductWarehouseSchema);

export default ProductWarehouse;