import Tokens from 'csrf'

const Token = new Tokens()
const secret = Token.secretSync()

export function sign(): string {
	return Token.create(secret)
}

export function verify(token: string):boolean {
	return Token.verify(secret, token)
}