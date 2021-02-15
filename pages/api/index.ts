import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import ResponseWrapper from '@utils/ResponseWrapper'

const HelloWorld = nc<NextApiRequest, NextApiResponse>()
	.get(async(_req, res) => {
		return ResponseWrapper(res, { code: 200, message: '>_<' })
	})

export default HelloWorld
