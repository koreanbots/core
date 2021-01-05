import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const HelloWorld: NextApiHandler = (_req: NextApiRequest, res: NextApiResponse) => {
	res.statusCode = 404
	res.json({ code: 404, message: '요청하신 URL에 페이지가 존재하지 않습니다.' })
}

export default HelloWorld
