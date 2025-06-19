import express, { Express } from 'express'
import { PORT } from './configs/secrets'
import rootRouter from './routes'
import { prismaClient, connectToDatabase } from './configs/prisma'
import { errorMiddleware } from './middlewares/errors'

const app: Express = express()

app.use(express.json())
app.use('/api', rootRouter)
app.use(errorMiddleware)

async function startServer() {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

startServer()
