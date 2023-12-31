import { NextFunction, Request, Response } from 'express'
import {
  ChangePasswordReqBody,
  FollowReqBody,
  GetProfileReqParams,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UnfollowReqParams,
  UpdateMeReqBody
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Error'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { config } from 'dotenv'
config() //để xài đc biến môi trường

export const logionController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  //nếu nó vào được đây, tức là nó đã đăng nhập thành công
  const user = req.user as User
  const user_id = user._id as ObjectId //ObjectId của mongoDB
  //server phải tạo ra access_token và refresh_token để đưa cho client
  const result = await userService.login({
    user_id: user_id.toString(),
    verify: user.verify
  })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
//1 req có params, query, Resbody, ReqBody
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await userService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  //lấy refresh_token từ req.body
  const { refresh_token } = req.body
  //vào database xóa refresh_token này
  const result = await userService.logout(refresh_token)
  res.json(result)
}

export const emailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  //kiểm tra user này đã verify hay chưa
  const user = req.user as User
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu mà xuống đc đây nghĩa là user này chưa verify, chưa bị banned, và khớp mã
  //mình tiến thành update: verify: 1, xóa email_verify_token, update_at
  const result = await userService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESSFULLY,
    result
  })
}

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  //nếu code vào ddc đây nghĩa là đã đi qua được tầng access token validator
  //nghĩa là trong req đã có decoded_authorization
  const { user_id } = req.decoded_authorization as TokenPayload
  //lấy user từ database
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }
  //nếu có thì kiểm tra xem thằng này đã bị banned chưa
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu chưa verify thì tiến hành update cho user đó mã mới
  const result = await userService.resendEmailVerify(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  //lấy user_id từ req.user
  const { _id, verify } = req.user as User
  //tiến hành update lại forgot password token
  const result = await userService.forgotPassword({
    user_id: (_id as ObjectId).toString(),
    verify
  })
  return res.json(result)
}

export const verifyForgorPasswordTokenController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  return res.json({
    message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_SUCCESSFULLY
  })
}

export const resetPasswordController = async (req: Request, res: Response) => {
  // muốn cập nhật mật khẩu mới cần user_id và password mới
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  //cập nhật password mới cho user có user_id này
  const result = await userService.resetPassword({ user_id, password })
  return res.json(result)
}

export const getMeController = async (req: Request, res: Response) => {
  //muốn lấy thông tin của user thì cần user_id
  const { user_id } = req.decoded_authorization as TokenPayload
  //tiến hành vòa database tìm và lấy thông tin user
  const user = await userService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
  //muốn update thông tin của user thì cần user_id, và những trong ngta muốn update
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  //update user thông qua user_id với body được choh
  const result = await userService.updateMe(user_id, body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
}
export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response) => {
  //muốn láy thông tin của user thì cần username
  const { username } = req.params
  //tiến hành vào database tìm và lấy thông tin user
  const user = await userService.getProfile(username)
  return res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    result: user
  })
}

export const followController = async (
  req: Request<ParamsDictionary, any, FollowReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload //lấy user_id từ decoded_authorization của access_token
  const { followed_user_id } = req.body //lấy followed_user_id từ req.body
  const result = await userService.follow(user_id, followed_user_id) //chưa có method này
  return res.json(result)
}

export const unfollowController = async (req: Request<UnfollowReqParams>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload //lấy user_id từ decoded_authorization của access_token
  const { user_id: followed_user_id } = req.params //lấy user_id từ req.params là user_id của người mà ngta muốn unfollow
  const result = await userService.unfollow(user_id, followed_user_id) //unfollow chưa làm
  return res.json(result)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload //lấy user_id từ decoded_authorization của access_token
  const { password } = req.body //lấy old_password và password từ req.body
  const result = await userService.changePassword(user_id, password) //chưa code changePassword
  return res.json(result)
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  // khi qua middleware refreshTokenValidator thì ta đã có decoded_refresh_token
  //chứa user_id và token_type
  //ta sẽ lấy user_id để tạo ra access_token và refresh_token mới
  const { refresh_token } = req.body

  const { user_id, verify, exp } = req.decoded_refresh_token as TokenPayload //lấy refresh_token từ req.body
  const result = await userService.refreshToken({ user_id, verify, refresh_token, exp }) //refreshToken chưa code
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS, //message.ts thêm  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
    result
  })
}

export const oAuthController = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query // lấy code từ query params
  //tạo đường dẫn truyền thông tin result để sau khi họ chọn tại khoản, ta check (tạo | login) xong thì điều hướng về lại client kèm thông tin at và rf
  const { access_token, refresh_token, new_user } = await userService.oAuth(code as string)
  const urlRedirect = `${process.env.CLIENT_REDIRECT_CALLBACK}?access_token=${access_token}&refresh_token=${refresh_token}&new_user=${new_user}`
  return res.redirect(urlRedirect)
}
