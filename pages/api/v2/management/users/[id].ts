import { NextApiRequest } from 'next'

import { get, management } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import { checkUserFlag } from '@utils/Tools'
import ResponseWrapper from '@utils/ResponseWrapper'

const UserManagement = RequestHandler()
	.patch(async (req: ApiRequest, res) => {
		const memberID = await get.Authorization(req.cookies.token)
		const member = memberID && await get.user.load(memberID)
		if(!member || !checkUserFlag(member.flags, 'staff')) return ResponseWrapper(res, { code: 403 })
		const user = await management.user.get(req.query.id ?? '')
		if(!user) return ResponseWrapper(res, { code: 404 })
		await management.user.update(req.query.id, { flags: req.body.flags })
		return ResponseWrapper(res, { code: 200 })
	})

interface ApiRequest extends NextApiRequest {
  query: {
    id: string
    date: string
  }
}
  
export default UserManagement