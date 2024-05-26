import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  name,
  email,
  phone,
  description,
  create_at,
} = propertiesSchema

export interface IContact {
  _id?: ObjectId;
  name?: string;
  email?: string;
  phone?: number;
  description?: string;
  create_at?: Date;
}

const ContactSchema: Schema = new Schema({
  name,
  email,
  phone,
  description,
  create_at,
});

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;

