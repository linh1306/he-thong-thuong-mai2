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
  _id?: string,
  name?: string,
  _category?: string,
  price?: number,
  description?: string,
  urlImage?: string,
  percentSale?: number,
  unit?: string
}
export interface IDeleteProductParams {
  _id: string
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