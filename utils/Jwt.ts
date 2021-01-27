import * as fs from 'fs'
import * as jwt from 'jsonwebtoken'

const publicPem = fs.readFileSync('./public.pem')
const privateKey = fs.readFileSync('./private.key')

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
	} catch {
		return null
	}
}

interface JWTSignOption {
  expiresIn: number | string
}
