import { fetcher } from "..";

const path = {
  contact: '/api/product'
}

const getProducts = async (params: object): Promise<any> => {
  return fetcher({ url: path.contact, method: "get", params: params ?? {} })
}

export { getProducts };