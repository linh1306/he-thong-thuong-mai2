import { ObjectId } from "mongoose";
import { fetcher } from "..";

const path = {
  discount: '/api/admin/discount'
}

export interface ICreateDiscountBody {
  code: string,
  name: string,
  value: number,
  quantity: number
}

const getDiscounts = async (params?: object): Promise<any> => {
  return fetcher({ url: path.discount, method: "get", params })
}

const createDiscount = async (body: ICreateDiscountBody): Promise<any> => {
  return fetcher({ url: path.discount, method: "put", data: body })
}

export { getDiscounts, createDiscount };