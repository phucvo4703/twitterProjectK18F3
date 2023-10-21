//ta sẽ làm chức năng đăng nhập ./login
//khi mà đăng nhập, thì client sẽ truy cập /login
//tạo ra 1 request, và bỏ vào trong đó email, password
// nhét email, password vào trong req.body

import { checkPrimeSync } from 'crypto'
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import userService from '~/services/users.services'
import { validate } from '~/utils/validation'
//interface được đùng để bổ nghĩa cho một object
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing email or password'
    })
  }
  next()
}

/*
body: {
  name,
  email,
  password,
  confirm-password,
  date_of_birth,
}
*/

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const isExist = await userService.checkEmailExist(value)
          if (isExist) {
            throw new Error('Email already exists')
          }
          return true // k co return true thi no pending quai
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1
        }
      },
      errorMessage:
        'Password must be at least 8 characters long, contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol'
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1
        }
      },
      errorMessage:
        'confirm_password must be at least 8 characters long, contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Confirm_password must match password')
          }
          return true // k co return true thi no pending quai
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
