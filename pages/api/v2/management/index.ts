import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'

const BotSubmits = RequestHandler().get(async (_req, res) => {
	return ResponseWrapper(res, { code: 403, message: 'Private API' })
})

export default BotSubmits
