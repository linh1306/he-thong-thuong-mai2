import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  description,
  rate,
  create_at,
} = propertiesSchema

export interface IFeedback {
  _id?: ObjectId;
  _user?: ObjectId;
  _product?: ObjectId;
  _feedback?: ObjectId;
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

