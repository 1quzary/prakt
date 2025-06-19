import { Router } from 'express'
import { signup, login } from '../controllers/auth'
import { signupSchema, loginSchema } from '../schema/users'
import { validateBody } from '../middlewares/validate'

const authRoutes = Router()

authRoutes.post('/signup', validateBody(signupSchema), signup)
authRoutes.post('/login', validateBody(loginSchema), login)

export default authRoutes
