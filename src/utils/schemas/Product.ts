import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  name,
  price,
  unitsInStock,
  description,
  quantity,
  urlImage,
  percentSale,
  numberOfReviews,
  sumRating,
  unit
} = propertiesSchema

export interface IProduct {     //Mặt hàng
  _id?: ObjectId,
  name: string,                 //Tên mặt hàng
  _category?: ObjectId,         //Loại mặt hàng
  price: number,                //giá
  unitsInStock: number,         //
  description: string,          //mô tả
  quantity: number,             //số lượng còn lại trong kho
  urlImage: string,             //hình ảnh
  percentSale: number,          //giảm giá %
  numberOfReviews: number,      //số lượt đánh giá
  sumRating: number,            //tổng điểm đánh giá
  unit: string                  //đơn vị mặt hàng
}

const ProductSchema: Schema = new Schema({
  name,
  _category: {
    type: Schema.ObjectId,
    ref: "Category",
  },
  price,
  unitsInStock,
  description,
  quantity,
  urlImage,
  percentSale,
  numberOfReviews,
  sumRating,
  unit
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;