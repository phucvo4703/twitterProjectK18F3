import { Request, Response, NextFunction, RequestHandler } from 'express'

//nhận vào một hàm async
export const wrapAsync = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //vì 1 hàm async mặc định là promise nên phải await
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
