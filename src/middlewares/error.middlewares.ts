import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Error'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //error handler tổng //đây là nơi tập kết tất cả các lỗi trên toàn bộ hệ thống
  console.log('error handler tổng')
  //có những lỗi k có status nên quy về lỗi 500
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
    //lỗi từ cái nơi đổ về có khả năng k có message// k nên err.message
    //json(omit(err, ['status'])) omit của lodash có khả năng loại bỏ thuộc tính ra khoi object // loại bỏ status
  }
  //nếu không lọt vào if ở trên tức là Error này là lỗi mặc định
  // lỗi mặc định có cấu trúc name, message, stack mà 3 thằng này có enumarable = false
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, ['stack'])
  })
}
