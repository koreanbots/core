import ResponseWrapper from '@utils/ResponseWrapper'
import RequestHandler from '@utils/RequestHandler'

const NotFound = RequestHandler().all(async (_req, res) => {
	return ResponseWrapper(res, { code: 404, message: '요청하신 URL에 페이지가 존재하지 않습니다.' })
})

export default NotFound
