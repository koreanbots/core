import { NextApiRequest } from 'next'

import { get } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import RequestHandler from '@utils/RequestHandler'

const Users = RequestHandler().get(async (req: ApiRequest, res) => {
	console.log(req.query)
	const user = await get.user.load(req.query?.id)
	if (!user) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 유저 입니다.' })
	else return ResponseWrapper(res, { code: 200, data: user })
})

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

export default Users
