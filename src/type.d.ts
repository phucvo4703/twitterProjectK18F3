import User from './models/schemas/User.schema'

//file này dùng để định nghĩa lại những cái có sẵn
declare module 'express' {
  interface Request {
    user?: User
  }
}
