import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  name,
  email,
  phone,
  description,
  status,
  create_at,
} = propertiesSchema

export interface IContact {     //liên hệ
  _id?: string;
  name?: string;
  email?: string;
  phone?: number;
  description?: string;
  status?: boolean;
  create_at?: Date;
}

const ContactSchema: Schema = new Schema({
  name,
  email,
  phone,
  description,
  status,
  create_at,
});

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;

