import { Router } from 'express'
import { logionController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.get('/login', loginValidator, logionController)

usersRouter.post('/register', registerValidator, registerController)
export default usersRouter
