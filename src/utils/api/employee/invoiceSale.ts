import { ObjectId } from "mongoose";
import { fetcher } from "..";
import { IProductInvoice } from "@/utils/schemas/ProductInvoice";
import { IProductWarehouse } from "@/utils/schemas/ProductWarehouse";

const path = {
  invoiceSale: '/api/employee/invoiceSale'
}

export interface IGetInvoiceSaleParams {
  [key: string]: any;
  searchKey?: string,
  currentPage: number,
  pageSize: number,
}

export interface IPutInvoiceSaleBody {
  _id: string,
  statusInvoice: 'confirmed' | 'payed' | 'success' | 'cancelled'
}

const getInvoiceSales = async (params?: IGetInvoiceSaleParams): Promise<any> => {
  return fetcher({ url: path.invoiceSale, method: "get", params })
}

const updateStatusInvoiceSale = async (body: IPutInvoiceSaleBody): Promise<any> => {
  return fetcher({ url: path.invoiceSale, method: "put", data: body })
}

export { getInvoiceSales, updateStatusInvoiceSale };