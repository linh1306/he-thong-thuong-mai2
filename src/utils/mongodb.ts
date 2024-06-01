import mongoose from 'mongoose';
import User from './schemas/User';
import Product from './schemas/Product';
import Category from './schemas/Category';
import Contact from './schemas/Contact';

const connection: { isConnected?: number } = {}

export default async function dbConnect() {
  if (connection.isConnected) {
    return
  }
  const uri = process.env.MONGODB_URI
  
  const db = await mongoose.connect(uri!);

  connection.isConnected = db.connections[0].readyState
  User
  Product
  Category
  Contact
}

