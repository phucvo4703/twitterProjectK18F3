import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'

const PORT = 3000

const app = express()
app.use(express.json()) //để cái app biết nhận dạng json để sài

databaseService.connect()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//http://localhost:3000/users/tweets
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`)
})

app.use('/users', usersRouter) //route handler
