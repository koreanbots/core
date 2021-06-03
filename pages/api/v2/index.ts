import { NextApiHandler } from 'next'
import RequestHandler from '@utils/RequestHandler'

const HelloWorld: NextApiHandler = RequestHandler().all(async (_req, res) => {
	res.status(200).json({ happy: 'hacking' })
})

export default HelloWorld
