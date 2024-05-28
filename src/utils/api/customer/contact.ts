import { fetcher } from "..";

const path = {
  contact: '/api/contact'
}

export interface ICreateContactParams {
  name: string,
  email: string,
  phone: string,
  description: string,
}

const createContact = async (body: ICreateContactParams): Promise<any> => {
  return fetcher({ url: path.contact, method: "post", data: body })
}

export { createContact };