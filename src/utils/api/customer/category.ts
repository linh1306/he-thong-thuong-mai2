import { fetcher } from "..";

const path = {
  contact: '/api/category'
}

const getCategory = async (): Promise<any> => {
  return fetcher({ url: path.contact, method: "get" })
}

export { getCategory };