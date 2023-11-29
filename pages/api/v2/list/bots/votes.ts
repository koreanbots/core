import { get } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'

import { Bot, List } from '@types'
import Yup from '@utils/Yup'

const VotesList = RequestHandler().get(async (req, res) => {
	const page = await Yup.number()
		.positive()
		.integer()
		.notRequired()
		.default(1)
		.label('페이지')
		.validate(req.query.page)
		.then((el) => el)
		.catch((e) => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
		})
	if (!page) return
	const result = await get.list.votes.load(page)
	return ResponseWrapper<List<Bot>>(res, { code: 200, data: result })
})

export default VotesList
