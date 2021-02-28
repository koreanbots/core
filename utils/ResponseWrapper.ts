import http from 'http'
import { NextApiResponse } from 'next'
import { ResponseProps } from '@types'
import { ErrorText } from './Constants'
export default function ResponseWrapper<T = unknown>(
	res: NextApiResponse,
	{ code = 200, message, version = 2, data, errors }: ResponseProps<T>
) {
	if (!code) throw new Error('`code` is required.')
	if (!http.STATUS_CODES[code]) throw new Error('Invalid http code.')
	res.statusCode = code
	res.setHeader('Access-Control-Allow-Origin', process.env.KOREANBOTS_URL)
	res.json({
		code,
		data,
		errors,
		version,
		...(message || !data ? { message: message || ErrorText[code] || http.STATUS_CODES[code] } : {}),
	})
}
