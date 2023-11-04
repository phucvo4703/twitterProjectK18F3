import { Request, Response, NextFunction, RequestHandler } from 'express'

//nhận vào một hàm async
export const wrapAsync = <P>(func: RequestHandler<P>) => {
  //ở đây dùng currying cũng đc
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      //vì 1 hàm async mặc định là promise nên phải await
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
