import { ObjectId } from "mongoose";
import { fetcher } from "..";

const path = {
  Product: '/api/admin/product'
}

export interface ICreateProductParams {
  name: string,
  _category: string,
  price: number,
  description: string,
  urlImage: string,
  unit: string
}
export interface IUpdateProductParams {
  _id: ObjectId,
  name: string,
  urlImage: string
}
export interface IDeleteProductParams {
  _id: ObjectId
}

const createProduct = async (body: ICreateProductParams): Promise<any> => {
  return fetcher({ url: path.Product, method: "post", data: body })
}
const updateProduct = async (body: IUpdateProductParams): Promise<any> => {
  return fetcher({ url: path.Product, method: "put", data: body })
}
const deleteProduct = async (body: IDeleteProductParams): Promise<any> => {
  return fetcher({ url: path.Product, method: "delete", data: body })
}

export { createProduct, updateProduct, deleteProduct };