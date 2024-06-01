import { fetcher } from "..";

const path = {
  getMe: '/api/auth/getMe'
}

const getMe = async (): Promise<any> => {
  return fetcher({ url: path.getMe, method: "get" })
}

export { getMe };