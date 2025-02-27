import { fetcher } from ".";

const path = {
  signIn: '/api/auth/signIn',
  signUp: '/api/auth/signUp',
  logout: '/api/auth/logout',
}

export interface ISignInParams {
  email: string;
  password: string;
}

export interface ISignUpParams {
  name: string,
  email: string,
  password: string,
  address: string[],
  phone: string,
}

const signUp = async (body: ISignUpParams): Promise<any> => {
  return fetcher({ url: path.signUp, method: "post", data: body })
}

const signIn = async (body: ISignInParams): Promise<any> => {
  return fetcher({ url: path.signIn, method: "post", data: body })
}

const deleteToken = async (): Promise<any> => {
  return fetcher({ url: path.logout, method: "get" })
}

export { signUp, signIn, deleteToken };