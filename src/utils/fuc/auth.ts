import User from "../schemas/User";
import { verifyToken } from "./tokenJwt";

export default async function getRoleWithToken() {
  const { payloadToken } = verifyToken()
  const user = payloadToken._id ? await User.findById(payloadToken._id) : { role: null }
  return { roleUser: user.role, payloadToken}
}