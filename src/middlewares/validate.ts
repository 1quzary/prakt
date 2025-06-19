import { RequestHandler } from 'express'
import { ZodSchema } from 'zod'
import { UnproccesableEntity } from '../exceptions/validation'
import { Ecode } from '../exceptions/root'

export function validateBody(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (err: any) {
      next(new UnproccesableEntity(err?.issues, 'Unprocessable Entity', Ecode.UNPROCCESABLE_ENTITY))
    }
  }
}
