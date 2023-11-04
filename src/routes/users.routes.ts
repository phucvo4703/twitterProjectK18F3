import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  logionController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  verifyForgorPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidation
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.get('/login', loginValidator, wrapAsync(logionController))

/*
Description: Register new user
Path: /register
Method: POST
body:{
    name: string
    email:string
    password:string
    confirm_password:string
    date_of_birth:string theo chuẩn ISO 8601

}
*/

usersRouter.post('/register', registerValidator, wrapAsync(registerController))

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/*
description: verify email
method: post
Path:/users/verify-email
body: {
  email_verify_token: string
}
*/
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))

/*
des: resed verify email
method: post 
path: /users/resend-verify-email
headers: {Authorization: "Bearer access_token"}
*/
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/*
des: forgot password
method: post
path: /users/forgot-password
body:{
  email: string
}
*/
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/**
 des: verify forgot password
 method: post
 path: /users/verify-forgot-password
 body: {
  forgot_password_token:string
 }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidation,
  wrapAsync(verifyForgorPasswordTokenController)
)

/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))
export default usersRouter
