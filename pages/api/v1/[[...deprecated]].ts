import ResponseWrapper from '@utils/ResponseWrapper'
import RequestHandler from '@utils/RequestHandler'

const Deprecated = RequestHandler().all(async (_req, res) => {
	return ResponseWrapper(res, {
		code: 406,
		message: '해당 API 버전은 지원 종료되었습니다.',
		version: 1,
	})
})

export default Deprecated
