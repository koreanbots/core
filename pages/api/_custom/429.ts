import ResponseWrapper from '@utils/ResponseWrapper'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const RateLimit: NextApiHandler = (_req: NextApiRequest, res: NextApiResponse) => {
	res.statusCode = 429
	return ResponseWrapper(res, {
		code: 429,
		message: '지정된 시간에 너무 많은 요청을 보냈습니다. 잠시 뒤에 시도해주세요.',
		errors: ['지정된 시간에 너무 많은 요청을 보냈습니다. 잠시 뒤에 시도해주세요.'],
	})
}

export default RateLimit
