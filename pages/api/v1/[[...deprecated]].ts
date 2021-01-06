import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { ResponseWrapper } from '../../../utils'

const Deprecated: NextApiHandler = (_req: NextApiRequest, res: NextApiResponse) => {
	const response = ResponseWrapper(res, {
		code: 406,
		message: '해당 API 버전은 지원 종료되었습니다.',
		version: 1,
	})
	res.json(response)
}

export default Deprecated
