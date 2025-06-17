import { NextFunction, Request, Response } from 'express'
import { Exception } from '../exceptions/root'

export const errorMiddleware = (
	error: Exception,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(error.scode).json({
		message: error.message,
		ecode: error.ecode,
		errors: error.errors,
	})
}
