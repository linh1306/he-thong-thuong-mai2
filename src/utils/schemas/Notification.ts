import mongoose, { Schema } from 'mongoose';
import propertiesSchema from './index'
import { IUser } from './User';

const {
  code,
  description,
  status,
  create_at
} = propertiesSchema

export interface INotification {
  _id?: string;
  _user?: IUser | string,
  code?: string,
  description?: string[],
  status?: boolean,
  create_at?: Date
}

export const NotificationSchema: Schema = new Schema({
  _user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  code,
  description,
  status,
  create_at
});

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;

