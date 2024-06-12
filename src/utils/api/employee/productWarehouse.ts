import { fetcher } from "..";
import { IProductInvoice } from "@/utils/schemas/ProductInvoice";
import { ISupplier } from "@/utils/schemas/Supplier";
import ProductWarehouse, { IProductWarehouse } from "@/utils/schemas/ProductWarehouse";

const path = {
  productWarehouse: '/api/employee/productWarehouse'
}

export interface IGetProductWarehouseParams {
  _product?: string,
  currentPage: number,
  pageSize: number,
}

type IProductItem = IProductInvoice & IProductWarehouse

export interface IPostProductWarehouseBody {
  _products: IProductItem[],
  _supplier: string,
}

const getProductWarehouses = async (params?: IGetProductWarehouseParams): Promise<any> => {
  return fetcher({ url: path.productWarehouse, method: "get", params })
}

const createProductWarehouse = async (body: IPostProductWarehouseBody): Promise<any> => {
  return fetcher({ url: path.productWarehouse, method: "post", data: body })
}

export { getProductWarehouses, createProductWarehouse };