import { ObjectId } from "mongoose";
import { fetcher } from "..";
import { ISupplier } from "@/utils/schemas/Supplier";

const path = {
  supplier: '/api/admin/supplier'
}

export interface IGetSupplierParams {
  currentPage: number,
  pageSize: number,
}
export interface IPostSupplierBody {
  name: string,
  phone: string,
  address: string[]
}
export interface IPutSupplierBody {
  _id: string,
  name: string,
  phone: string,
  address: string[]
}
export interface IDeleteSupplierBody {
  _id: string
}

const getSuppliers = async (params?: IGetSupplierParams): Promise<any> => {
  return fetcher({ url: path.supplier, method: "get", params })
}

const createSupplier = async (body: IPostSupplierBody): Promise<any> => {
  return fetcher({ url: path.supplier, method: "post", data: body })
}
const updateSupplier = async (body: IPutSupplierBody): Promise<any> => {
  return fetcher({ url: path.supplier, method: "put", data: body })
}
const deleteSupplier = async (body: IDeleteSupplierBody): Promise<any> => {
  return fetcher({ url: path.supplier, method: "delete", data: body })
}

export { getSuppliers, createSupplier, updateSupplier, deleteSupplier };