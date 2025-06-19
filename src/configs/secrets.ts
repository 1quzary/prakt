import dotenv from 'dotenv'

import path from 'path'

dotenv.config({
  path: path.resolve(__dirname, '.env'), // ./src/configs/.env
})

dotenv.config({
  path: path.resolve(__dirname, '.env.users'), // ./src/configs/.env
})

export const PORT = process.env.PORT

export const JWT_SECRET = process.env.JWT_SECRET!
