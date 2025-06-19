import { Router } from 'express'
import { signup, login, forgotPassword } from '../controllers/auth'
import { signupSchema, loginSchema, forgotPasswordSchema } from '../schema/users'
import { validateBody } from '../middlewares/validate'

const authRoutes = Router()

authRoutes.post('/signup', validateBody(signupSchema), signup)
authRoutes.post('/login', validateBody(loginSchema), login)
authRoutes.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword)

export default authRoutes
