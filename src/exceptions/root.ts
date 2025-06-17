export class Exception extends Error {
	message: string
	ecode: any
	scode: number
	errors: Ecode
	constructor(message: string, ecode: Ecode, scode: number, error: any) {
		super(message)

		this.message = message
		this.ecode = ecode
		this.scode = scode
		this.errors = error
	}
}

export enum Ecode {
	USER_NOT_FOUND = 1,
	USER_ALREADY_EXISTS = 2,
	INCORRECT_PASSWORD = 3,
}
