import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  name,
  email,
  password,
  address,
  phone,
  create_at,
  role,
  urlImage,
} = propertiesSchema

export interface IUser {
  _id?: ObjectId;
  name?: string;
  email?: string;
  password?: string;
  address?: string[];
  phone?: string;
  create_at?: Date;
  role?: 'customer' | 'admin' | 'employee';
  urlImage?: string;
}

const UserSchema: Schema = new Schema({
  name,
  email,
  password,
  address,
  phone,
  create_at,
  role,
  urlImage,
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

