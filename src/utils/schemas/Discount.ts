import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  name,
  value,
  exp_at,
  quantity,
} = propertiesSchema

export interface IDiscount {          //mã giảm giá
  _id?: ObjectId;
  name?: string;
  value?: number;
  exp_at?: Date;
  quantity?: number;
}

const DiscountSchema: Schema = new Schema({
  name,
  value,
  exp_at,
  quantity
});

const Discount = mongoose.models.Discount || mongoose.model<IDiscount>('Discount', DiscountSchema);

export default Discount;

