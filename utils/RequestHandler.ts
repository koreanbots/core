import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import rateLimit from 'express-rate-limit'

import ResponseWrapper from '@utils/ResponseWrapper'
import { GlobalRatelimitIgnore } from '@utils/Constants'

const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 120,
	statusCode: 429,
	handler: (_req, res) => ResponseWrapper(res, { code: 429 }),
	keyGenerator: (req) => req.headers['x-forwarded-for'] as string,
	skip: (req, res) => {
		res.setHeader('X-RateLimit-Global', 'true')
		if(GlobalRatelimitIgnore.map(el => req.url.startsWith(el)).find(el => el)) return true
		return false
	}
})
const RequestHandler = () =>
	nc<NextApiRequest, NextApiResponse>({
		onNoMatch(_req, res) {
			return ResponseWrapper(res, { code: 405 })
		},
	})
		.use(limiter)

export default RequestHandler
