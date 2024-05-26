import mongoose from 'mongoose';

const connection: { isConnected?: number } = {}

export default async function dbConnect() {
  if (connection.isConnected) {
    return
  }
  const uri = process.env.MONGODB_URI
  
  const db = await mongoose.connect(uri!);

  connection.isConnected = db.connections[0].readyState
}



