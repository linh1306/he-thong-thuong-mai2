import { ObjectId } from "mongoose";
import { fetcher } from "..";

const path = {
  User: '/api/admin/user'
}

export interface IUpdateRoleUserParams {
  _id: ObjectId,
  role: 'customer' | 'admin' | 'employee'
}

const getUsers = async (): Promise<any> => {
  return fetcher({ url: path.User, method: "get" })
}
const updateRoleUser = async (body: IUpdateRoleUserParams): Promise<any> => {
  return fetcher({ url: path.User, method: "put", data: body })
}


export { updateRoleUser, getUsers };