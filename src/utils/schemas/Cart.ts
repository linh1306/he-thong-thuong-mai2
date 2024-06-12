import mongoose, { Schema } from 'mongoose';
import { IProduct } from './Product';

export interface IItemCart {      //giỏ hàng
  _product: IProduct,
  quantity: number,
}

export interface ICart {      //giỏ hàng
  _id?: string;
  _products: IItemCart[];
}

const CartSchema: Schema = new Schema({
  _products: [
    {
      _product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number },
    }
  ]
});

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;

