import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { Follower } from '~/models/schemas/Followers.schema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@tweetprojectk18f3.beg5rk8.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

//nếu export class thì phải tạo object từ class
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Lỗi trong quá trình kết nối mongo' + error)
      throw error
    }
  }
  //accessor prop
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTIONS as string) //nói với nó cái này chắc chắn là string//ép nó hiểu
  }

  async indexUsers() {
    // unique để tìm kiếm không trùng username và email
    await this.users.createIndex({ username: 1 }, { unique: true }) //register
    await this.users.createIndex({ email: 1 }, { unique: true }) //getProfile
    await this.users.createIndex({ email: 1, password: 1 }) //login
  }

  get refreshToken(): Collection<RefreshToken> {
    //nhớ sửa tên database nha thằng chó Phúc
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTIONS as string) //nói với nó cái này chắc chắn là string//ép nó hiểu
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }
  //trong file .env thêm DB_FOLLOWERS_COLLECTION = 'followers'
}

const databaseService = new DatabaseService() // tạo object
export default databaseService //export object
