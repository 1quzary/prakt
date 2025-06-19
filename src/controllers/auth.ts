import { RequestHandler } from 'express'
import { z } from 'zod'
import { signupSchema, loginSchema, forgotPasswordSchema } from '../schema/users'
import { prismaClient } from '../configs/prisma'
import { hashSync, compareSync } from 'bcrypt'
import { Ecode } from '../exceptions/root'
import { brException } from '../exceptions/bad_requests'
import { UnproccesableEntity } from '../exceptions/validation'
import { generateToken } from '../utils/jwt'
import { generateRandomPassword } from '../utils/generatePassword'
import { Resend } from 'resend'

const resend = new Resend('re_4HhxR6my_JPMqP1DD4brjdKQAE6KNmAdF')

type SignupInput = z.infer<typeof signupSchema>
type LoginInput = z.infer<typeof loginSchema>
type forgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const signup: RequestHandler<unknown, unknown, SignupInput> = async (req, res, next) => {
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
}

export const login: RequestHandler<unknown, unknown, LoginInput> = async (req, res, next) => {
  loginSchema.parse(req.body)
  const { email, password } = req.body

  const userWithEmail = await prismaClient.user.findFirst({ where: { email } })
  if (!userWithEmail || !compareSync(password, userWithEmail.password)) {
    return next(new brException('Invalid email or password', Ecode.INVALID_CREDENTIALS))
  }

  const token = generateToken({ userId: userWithEmail.id })
  res.json({ user: userWithEmail, token })
}

export const forgotPassword: RequestHandler<unknown, unknown, forgotPasswordInput> = async (
  req,
  res,
  next
) => {
  forgotPasswordSchema.parse(req.body)
  const { email } = req.body

  const user = await prismaClient.user.findFirst({ where: { email } })
  if (user) {
    const newPassword = generateRandomPassword()
    const hashedPassword = hashSync(newPassword, 10)

    await prismaClient.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'senyk.yaroslav@student.uzhnu.edu.ua',
      subject: 'Your new password',
      html: `<p>Your new password is: <strong>${newPassword}</strong></p>`,
    })
  }

  res.json({ message: 'If the email is registered, you will receive a new password.' })
}
