import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
config()
import argv from 'minimist'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import { MongoClient } from 'mongodb'
const options = argv(process.argv.slice(2))
console.log(options)
const PORT = process.env.PORT || 4000

const app = express()
initFolder()
app.use(express.json()) //để cái app biết nhận dạng json để sài

databaseService.connect().then(() => {
  databaseService.indexUsers()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', usersRouter) //route handler
app.use('/medias', mediasRouter)
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use('/static', staticRouter)
// app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

//http://localhost:3000/users/tweets
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`)
})
