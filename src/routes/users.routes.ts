import { Router } from 'express'
import { logionController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
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
export default usersRouter
