import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { EntityError, ErrorWithStatus } from '~/models/Error'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  //nhận vào checksheme và trả ra middleware
  return async (req: Request, res: Response, next: NextFunction) => {
    //hàm run trả ra Promise phải đùng await
    await validation.run(req) //đi qua từng cái check dữ liệu và lưu lỗi vào req

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    const errorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorObject) {
      //lấy msg của từng lỗi ra
      const { msg } = errorObject[key]
      //thằng k phải 422 sẽ có cấu trúc giống errorWithStatus và status khác 422 ném cho default error handler
      if (msg instanceof ErrorWithStatus && msg.status !== 422) {
        return next(msg) //các lỗi đặc biệt khác lỗi 422 chỉ báo từng cái 1
        //phải xử lí xong mới được qua lỗi đặc biệt khác
      }
      //nếu xuống được đây thì m là lỗi 422
      entityError.errors[key] = msg
    }
    next(entityError)
  }
}
