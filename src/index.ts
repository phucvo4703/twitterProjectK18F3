import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const PORT = 3000

const app = express()
app.use(express.json()) //để cái app biết nhận dạng json để sài

databaseService.connect()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', usersRouter) //route handler

app.use(defaultErrorHandler)

//http://localhost:3000/users/tweets
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`)
})
