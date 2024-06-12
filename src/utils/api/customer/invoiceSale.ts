import { fetcher } from "..";
import { IItemCart } from "@/utils/schemas/Cart";

const path = {
  contact: '/api/invoiceSale'
}

export interface IBodyCreateInvoiceSale {
  codeDiscount?: string,
  address: string[],
  _products: IItemCart[],
}

const createInvoiceSale = async (body: IBodyCreateInvoiceSale): Promise<any> => {
  return fetcher({ url: path.contact, method: "post", data: body })
}

export { createInvoiceSale };