import * as jwt from 'jsonwebtoken'

const publicPem = process.env.PUBLIC_PEM?.replace(/\\n/g, '\n')
const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n')

export function sign(payload: string | Record<string, unknown>, options?: JWTSignOption): string | null {
	try {
		return jwt.sign(payload, privateKey, options ? { ...options, algorithm: 'RS256' } : { algorithm: 'RS256' })
	} catch {
		return null
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verify(token: string): any | null {
	try {
		return jwt.verify(token, publicPem)
	} catch(e) {
		console.log(e)
		return null
	}
}

interface JWTSignOption {
  expiresIn: number | string
}
