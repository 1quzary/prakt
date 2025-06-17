import { NextFunction, Request, Response } from 'express'
import { prismaCilent } from '..'
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import { brException } from '../exceptions/bad_requests'
import { Ecode } from '../exceptions/root'

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password, name } = req.body

	let user = await prismaCilent.user.findFirst({ where: { email } })
	if (user) {
		next(new brException('User already exists', Ecode.USER_ALREADY_EXISTS))
	}
	user = await prismaCilent.user.create({
		data: {
			name,
			email,
			password: hashSync(password, 10),
		},
	})
	res.json(user)
}

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body

	let user = await prismaCilent.user.findFirst({ where: { email } })
	if (!user) {
		throw Error('User does not exists')
	}
	if (!compareSync(password, user.password)) {
		throw Error('Incorrect password!')
	}
	const token = jwt.sign(
		{
			userId: user.id,
		},
		JWT_SECRET
	)
	res.json({ user, token })
}
