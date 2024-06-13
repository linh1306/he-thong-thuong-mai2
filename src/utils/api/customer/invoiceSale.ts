import { fetcher } from "..";
import { IItemCart } from "@/utils/schemas/Cart";

const path = {
  contact: '/api/invoiceSale'
}

export interface IParamsInvoiceSaleMe {
  currentPage: number,
  pageSize: number,
}
export interface IBodyCreateInvoiceSale {
  codeDiscount?: string,
  address: string[],
  _products: IItemCart[],
}

const getInvoiceSalesMe = async (params: IParamsInvoiceSaleMe): Promise<any> => {
  return fetcher({ url: path.contact, method: "get", data: params })
}

const createInvoiceSale = async (body: IBodyCreateInvoiceSale): Promise<any> => {
  return fetcher({ url: path.contact, method: "post", data: body })
}

export { getInvoiceSalesMe, createInvoiceSale };