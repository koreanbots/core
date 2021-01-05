import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const HelloWorld: NextApiHandler = (_req: NextApiRequest, res: NextApiResponse) => {
	res.statusCode = 200
	res.json({ happy: 'hacking' })
}

export default HelloWorld
