import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient({
  log: ['query'],
})

export async function connectToDatabase() {
  try {
    await prismaClient.$connect()
    console.log('Successfully connected to the database')
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}
