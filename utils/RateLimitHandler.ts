import { NextApiResponse } from 'next'
import ResponseWrapper from './ResponseWrapper'

export default function RateLimitHandler(res: NextApiResponse, ratelimit: RateLimit) {
	res.setHeader('x-ratelimit-limit', ratelimit.limit)
	res.setHeader(
		'x-ratelimit-remaining',
		600 - (ratelimit.used > ratelimit.limit ? ratelimit.limit : ratelimit.used)
	)
	res.setHeader('x-ratelimit-reset', Math.round(ratelimit.reset / 1000))
	if (ratelimit.limit < ratelimit.used) {
		if (ratelimit.onLimitExceed) ratelimit.onLimitExceed(res)
		else ResponseWrapper(res, { code: 429 })
		return true
	}
}

interface RateLimit {
	used: number
	limit: number
	reset: number
	onLimitExceed: (res: NextApiResponse) => void | Promise<void>
}
