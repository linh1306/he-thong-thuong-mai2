import { fetcher } from "..";

const path = {
  notification: '/api/notification'
}


export interface IBodyUpdateStatusNotification {
  _id: string,
  status: boolean
}

const getNotificationsMe = async (): Promise<any> => {
  return fetcher({ url: path.notification, method: "get" })
}

const updateStatusNotification = async (body: IBodyUpdateStatusNotification): Promise<any> => {
  return fetcher({ url: path.notification, method: "post", data: body })
}

export { getNotificationsMe, updateStatusNotification };