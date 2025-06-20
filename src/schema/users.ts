import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})
