import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import ResponseWrapper from '@utils/ResponseWrapper'

const RequestHandler = () =>
	nc<NextApiRequest, NextApiResponse>({
		onNoMatch(_req, res) {
			return ResponseWrapper(res, { code: 405 })
		},
		onError(err, _req, res) {
			console.error(err)
			return ResponseWrapper(res, { code: 500 })
		},
	})

export default RequestHandler
