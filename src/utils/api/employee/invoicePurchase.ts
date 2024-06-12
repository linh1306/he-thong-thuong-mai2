import { fetcher } from "..";
import { IProductInvoice } from "@/utils/schemas/ProductInvoice";
import { ISupplier } from "@/utils/schemas/Supplier";
import { IProductWarehouse } from "@/utils/schemas/ProductWarehouse";

const path = {
  invoicePurchase: '/api/employee/invoicePurchase'
}

export interface IGetInvoicePurchaseParams {
  _product?: string,
  _supplier?: string,
  currentPage: number,
  pageSize: number,
}

type IProductItem = IProductInvoice & IProductWarehouse

export interface IPostInvoicePurchaseBody {
  _products: IProductItem[],
  _supplier: string,
}

const getInvoicePurchases = async (params?: IGetInvoicePurchaseParams): Promise<any> => {
  return fetcher({ url: path.invoicePurchase, method: "get", params })
}

const createInvoicePurchase = async (body: IPostInvoicePurchaseBody): Promise<any> => {
  return fetcher({ url: path.invoicePurchase, method: "post", data: body })
}

export { getInvoicePurchases, createInvoicePurchase };