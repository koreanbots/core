import { get } from '@utils/Query'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import ResponseWrapper from '@utils/ResponseWrapper'

const Users = nc<ApiRequest, NextApiResponse>()
	.get(async(req, res) => {
		console.log(req.query)
		const user = await get.user.load(req.query?.id)
		if(!user) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 유저 입니다.' })
		else return ResponseWrapper(res, { code: 200, data: user })
	})

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

export default Users