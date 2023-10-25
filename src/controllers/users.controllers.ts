import { NextFunction, Request, Response } from 'express'
import { RegisterReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'

export const logionController = async (req: Request, res: Response) => {
  //nếu nó vào được đây, tức là nó đã đăng nhập thành công
  const { user }: any = req
  const user_id = user._id //ObjectId
  //server phải tạo ra access_token và refresh_token để đưa cho client
  const result = await userService.login(user_id.toString())
  return res.json({
    message: 'Login successfully',
    result
  })
}
//1 req có params, query, Resbody, ReqBody
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await userService.register(req.body)
  return res.json({
    message: 'Register successfully',
    result
  })
}
