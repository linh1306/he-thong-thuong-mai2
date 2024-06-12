import { ObjectId } from "mongoose";
import { fetcher } from "..";

const path = {
  contact: '/api/admin/contact'
}

export interface IUpdateContactParams {
  _id: string,
  status: boolean,
}

const getContacts = async (params?: object): Promise<any> => {
  return fetcher({ url: path.contact, method: "get", params })
}

const updateStatusContact = async (body: IUpdateContactParams): Promise<any> => {
  return fetcher({ url: path.contact, method: "put", data: body })
}

export { getContacts, updateStatusContact };