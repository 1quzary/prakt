import { Exception } from './root'

export class UnproccesableEntity extends Exception {
	constructor(error: any, message: string, ecode: number) {
		super(message, ecode, 422, error)
	}
}
