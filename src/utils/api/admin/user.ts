import { ObjectId } from "mongoose";
import { fetcher } from "..";

const path = {
  User: '/api/admin/user'
}

export interface IGetUserParams {
  pageSize: number,
  currentPage: number,
  role: string,
  searchKey: string
}

export interface IUpdateRoleUserParams {
  _id: ObjectId,
  role: 'customer' | 'admin' | 'employee'
}

const getUsers = async (params: IGetUserParams): Promise<any> => {
  return fetcher({ url: path.User, method: "get", params: params })
}
const updateRoleUser = async (body: IUpdateRoleUserParams): Promise<any> => {
  return fetcher({ url: path.User, method: "put", data: body })
}


export { updateRoleUser, getUsers };