import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  name,
  urlImage,
} = propertiesSchema

export interface ICategory {      //loại mặt hàng
  _id?: ObjectId;
  name?: string;
  urlImage?: string
}

const CategorySchema: Schema = new Schema({
  name,
  urlImage
});

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

