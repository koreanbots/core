import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import ResponseWrapper from '@utils/ResponseWrapper'

const NotFound = nc<NextApiRequest, NextApiResponse>()
	.all(async(_req, res) => {
		return ResponseWrapper(res, { code: 404, message: '요청하신 URL에 페이지가 존재하지 않습니다.' })
	})

export default NotFound
