import { Router } from 'express'
import { serveImageController } from '~/controllers/meidas.controller'

const staticRouter = Router()
staticRouter.get('/image/:namefile', serveImageController) //chưa code
//vậy route sẽ là localhost:4000/static/image/:namefile
export default staticRouter
