import { ObjectId } from "mongoose";
import { fetcher } from "..";

const path = {
  notification: '/api/admin/notification'
}

export interface ICreateNotificationBody {
  _user: string,
  code: string,
  description: string
}


const createNotificationfromUser = async (body: ICreateNotificationBody): Promise<any> => {
  return fetcher({ url: path.notification, method: "put", data: body })
}

export { createNotificationfromUser };