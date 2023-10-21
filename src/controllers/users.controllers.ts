import { Request, Response } from 'express'
import { RegisterReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'

export const logionController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'test@gmail.com' && password === '123456') {
    return res.json({
      message: 'Login successfully',
      result: [
        { name: 'Phúc', yob: 2003 },
        { name: 'Phát', yob: 2004 },
        { name: 'Phương', yob: 2005 }
      ]
    })
  }
  res.status(400).json({
    message: 'Login failed',
    result: []
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await userService.register(req.body)
    return res.json({
      message: 'Register successfully',
      result
    })
  } catch (error) {
    res.status(400).json({
      message: 'Register failed',
      error
    })
  }
}
