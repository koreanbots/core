import { NextApiRequest } from 'next'

import { get } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import RequestHandler from '@utils/RequestHandler'

const Users = RequestHandler().get(async (req: ApiRequest, res) => {
	const auth = req.headers.authorization
		? await get.BotAuthorization(req.headers.authorization)
		: await get.Authorization(req.cookies.token)
	if (!auth) return ResponseWrapper(res, { code: 401 })
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
