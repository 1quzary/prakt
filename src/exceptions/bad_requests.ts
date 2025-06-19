import { Ecode, Exception } from './root'

export class brException extends Exception {
  constructor(message: string, ecode: Ecode) {
    super(message, ecode, 400, null)
  }
}
