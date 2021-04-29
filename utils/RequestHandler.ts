import { NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/node'
import nc from 'next-connect'
import rateLimit from 'express-rate-limit'

import ResponseWrapper from '@utils/ResponseWrapper'
import { GlobalRatelimitIgnore } from '@utils/Constants'
import { get } from './Query'

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true })
	],
	tracesSampleRate: 1.0,
	enabled: true
})

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
		onError: async (err, req, res) => {
			const user = await get.Authorization(req.cookies.token)
			Sentry.captureException(err, { user: { id: user || null, ip_address: req.headers['x-forwarded-for'] as string || null } })
			return ResponseWrapper(res, { code: 500 })
		},
	})
		.use(Sentry.Handlers.requestHandler())
		.use(Sentry.Handlers.tracingHandler())
		.use(limiter)

export default RequestHandler
