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
	USER_ALREADY_EXISTS = 1,
	UNPROCCESABLE_ENTITY = 2,
	USER_NOT_FOUND = 3,
	INCORRECT_PASSWORD = 4,
}
