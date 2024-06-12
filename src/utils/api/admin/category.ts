import { fetcher } from "..";

const path = {
  Category: '/api/admin/category'
}

export interface ICreateCategoryParams {
  name: string,
  urlImage: string
}
export interface IUpdateCategoryParams {
  _id: string,
  name: string,
  urlImage: string
}
export interface IDeleteCategoryParams {
  _id: string
}

const createCategory = async (body: ICreateCategoryParams): Promise<any> => {
  return fetcher({ url: path.Category, method: "post", data: body })
}
const updateCategory = async (body: IUpdateCategoryParams): Promise<any> => {
  return fetcher({ url: path.Category, method: "put", data: body })
}
const deleteCategory = async (body: IDeleteCategoryParams): Promise<any> => {
  return fetcher({ url: path.Category, method: "delete", data: body })
}

export { createCategory, updateCategory, deleteCategory };