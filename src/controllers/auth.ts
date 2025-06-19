import { RequestHandler } from 'express'
import { z } from 'zod'
import { signupSchema, loginSchema } from '../schema/users'
import { prismaClient } from '../configs/prisma'
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../configs/secrets'
import { Ecode } from '../exceptions/root'
import { brException } from '../exceptions/bad_requests'
import { UnproccesableEntity } from '../exceptions/validation'

type SignupInput = z.infer<typeof signupSchema>
type LoginInput = z.infer<typeof loginSchema>

export const signup: RequestHandler<unknown, unknown, SignupInput> = async (req, res, next) => {
  try {
    signupSchema.parse(req.body)
    const { email, password, name } = req.body

    const existingUser = await prismaClient.user.findFirst({ where: { email } })
    if (existingUser) {
      return next(new brException('User already exists', Ecode.USER_ALREADY_EXISTS))
    }

    const newUser = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    })
    res.json(newUser)
  } catch (err: any) {
    next(new UnproccesableEntity(err?.issues, 'Unprocessable Entity', Ecode.UNPROCCESABLE_ENTITY))
  }
}

export const login: RequestHandler<unknown, unknown, LoginInput> = async (req, res, next) => {
  try {
    loginSchema.parse(req.body)
    const { email, password } = req.body

    const userWithEmail = await prismaClient.user.findFirst({ where: { email } })
    if (!userWithEmail || !compareSync(password, userWithEmail.password)) {
      return next(new brException('Invalid email or password', Ecode.INVALID_CREDENTIALS))
    }

    const token = jwt.sign({ userId: userWithEmail.id }, JWT_SECRET)
    res.json({ user: userWithEmail, token })
  } catch (err: any) {
    next(new UnproccesableEntity(err?.issues, 'Unprocessable Entity', Ecode.UNPROCCESABLE_ENTITY))
  }
}
