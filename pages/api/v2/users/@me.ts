import { NextApiRequest } from 'next'

import { get } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import RequestHandler from '@utils/RequestHandler'

const UserMe = RequestHandler().get(async (req: ApiRequest, res) => {
	const user = await get.Authorization(req.cookies.token)
	if (!user) return ResponseWrapper(res, { code: 401 })
	else return ResponseWrapper(res, { code: 200, data: await get.user.load(user) })
})

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

export default UserMe
