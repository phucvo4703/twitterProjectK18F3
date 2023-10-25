import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()
//bản chất hàm này k phải là promise là đồng bộ
//đôi khi phải đợi kí
//nên dùng promise để hàm kí tên đợi và biến nó thành bất đồng bộ
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  //định nghĩa object
  payload: string | object | Buffer
  privateKey?: string //? k truyền vào thì lấy giá trị mặc định
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
