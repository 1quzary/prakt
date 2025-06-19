import { NextFunction, Request, Response } from 'express'
import { prismaCilent } from '..'
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import { brException } from '../exceptions/bad_requests'
import { Ecode } from '../exceptions/root'
import { UnproccesableEntity } from '../exceptions/validation'
import { signupSchema, loginSchema } from '../schema/users'

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    signupSchema.parse(req.body)
    const { email, password, name } = req.body

    let user = await prismaCilent.user.findFirst({ where: { email } })
    if (user) {
      next(new brException('User already exists', Ecode.USER_ALREADY_EXISTS))
    }
    user = await prismaCilent.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    })
    res.json(user)
  } catch (err: any) {
    next(new UnproccesableEntity(err?.issues, 'Unpocessable Entity', Ecode.UNPROCCESABLE_ENTITY))
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse(req.body)

    const { email, password } = req.body

    const user = await prismaCilent.user.findFirst({ where: { email } })
    if (!user) {
      return next(new brException('User not found', Ecode.USER_NOT_FOUND))
    }

    if (!compareSync(password, user.password)) {
      return next(new brException('Incorrect password', Ecode.INCORRECT_PASSWORD))
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET)

    res.json({ user, token })
  } catch (err: any) {
    next(new UnproccesableEntity(err?.issues, 'Unprocessable Entity', Ecode.UNPROCCESABLE_ENTITY))
  }
}
