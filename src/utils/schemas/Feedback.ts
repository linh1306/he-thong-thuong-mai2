import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'
import { IUser } from './User';
import { IProduct } from './Product';

const {
  description,
  rate,
  create_at,
} = propertiesSchema

export interface IFeedback {      //đánh giá sản phẩm
  _id?: string;
  _user?: IUser | string;
  _product?: IProduct | string;
  _feedback?: IFeedback | string;
  description?: string;
  rate?: number;
  create_at?: Date;
}

const FeedbackSchema: Schema = new Schema({
  _user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  _product: {
    type: Schema.ObjectId,
    ref: "Product",
  },
  _feedback: {
    type: Schema.ObjectId,
    ref: "Feedback",
  },
  description,
  rate,
  create_at,
});

const Feedback = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;

