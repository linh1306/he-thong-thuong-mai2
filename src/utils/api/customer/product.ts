import { fetcher } from "..";

const path = {
  product: '/api/product',
  getInfoProduct: '/api/product/info',
}

const getProducts = async (params?: object): Promise<any> => {
  return fetcher({ url: path.product, method: "get", params: params ?? {} })
}
const getInfoProduct = async (params?: object): Promise<any> => {
  return fetcher({ url: path.getInfoProduct, method: "get", params: params ?? {} })
}

export { getProducts, getInfoProduct };