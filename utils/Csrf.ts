import { parse, serialize } from 'cookie'
import csrf from 'csrf'

import { IncomingMessage, ServerResponse } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import ResponseWrapper from './ResponseWrapper'

const csrfKey = '_csrf'

const Token = new csrf()

export const tokenCreate = (): string => Token.create(process.env.CSRF_SECRET)

export const tokenVerify = (token: string): boolean => Token.verify(process.env.CSRF_SECRET, token)

export const getToken = (req: IncomingMessage, res: ServerResponse) => {
	const parsed = parse(req.headers.cookie || '')
	let key: string = parsed[csrfKey]
	if (!key || !tokenVerify(key)) {
		key = tokenCreate()
		res.setHeader(
			'set-cookie',
			serialize(csrfKey, key, {
				httpOnly: true,
				sameSite: 'lax',
				path: '/'
			})
		)
	}

	return key
}

export const checkToken = (req: NextApiRequest, res: NextApiResponse, token: string): boolean => {
	const parsed = parse(req.headers.cookie || '')
	if (parsed[csrfKey] !== token || !tokenVerify(token)) {
		ResponseWrapper(res, { code: 400, message: 'CSRF 검증 에러 (페이지를 새로고침해주세요)' })
		return false
	} else return true
}
