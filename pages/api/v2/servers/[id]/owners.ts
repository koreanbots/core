import type { NextApiRequest } from 'next'

import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get } from '@utils/Query'

const ServerOwners = RequestHandler()
	.get(async (req: GetApiRequest, res) => {
		const owners = await get.serverOwners(req.query.id)
		if(!owners) return ResponseWrapper(res, { code: 404 })
		return ResponseWrapper(res, { code: 200, data: owners })
	})

interface GetApiRequest extends NextApiRequest {
  query: {
    id: string
  }
}

export default ServerOwners