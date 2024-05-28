import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  name,
  phone,
  address,
} = propertiesSchema

export interface ISupplier {      //Nhà cung cấp
  _id?: ObjectId;
  name?: string;
  phone?: string;
  address?: string[];
}

const SupplierSchema: Schema = new Schema({
  name,
  phone,
  address,
});

const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', SupplierSchema);

export default Supplier;

