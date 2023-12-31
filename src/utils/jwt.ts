import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { TokenPayload } from '~/models/requests/User.requests'
config()
//bản chất hàm này k phải là promise là đồng bộ
//đôi khi phải đợi kí
//nên dùng promise để hàm kí tên đợi và biến nó thành bất đồng bộ
export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  //định nghĩa object
  payload: string | object | Buffer
  privateKey: string //? k truyền vào thì lấy giá trị mặc định
  options?: jwt.SignOptions
}) => {
  //đang kí tên có thể gặp lỗi nên dùng callback để xử lí lỗi
  return new Promise<string>((resolve, reject) => {
    //server nó phục vụ cho mình nên có thể reject để biết xử lí lỗi
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) reject(err)
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) throw reject(err)
      resolve(decoded as TokenPayload)
    })
  })
}
