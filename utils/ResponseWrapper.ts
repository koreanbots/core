import http from 'http'
import { NextApiResponse } from 'next'
export default function ResponseWrapper(
	res: NextApiResponse,
	{ code, message, version = 2, data, errors }: ResponseProps
) {
	if (!code) throw new Error('`code` is required.')
	if (!http.STATUS_CODES[code]) throw new Error('Invalid http code.')
	res.statusCode = code

	res.json({ code, message: message || http.STATUS_CODES[code], data, errors, version })
}

interface ResponseProps {
	code: number
	message?: string
	version?: number
	data?: Data
	errors?: string[]
}

interface Data {
	[key: string]: unknown
}
