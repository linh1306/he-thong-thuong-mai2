import mongoose, { Schema } from 'mongoose';
import propertiesSchema from './index'

const {
  name,
  code,
  value,
  exp_at,
  quantity,
} = propertiesSchema

export interface IDiscount {          //mã giảm giá
  _id?: string;
  code?:string;
  name?: string;
  value?: number;
  exp_at?: Date;
  quantity?: number;
}

const DiscountSchema: Schema = new Schema({
  name,
  code,
  value,
  exp_at,
  quantity
});

const Discount = mongoose.models.Discount || mongoose.model<IDiscount>('Discount', DiscountSchema);

export default Discount;

