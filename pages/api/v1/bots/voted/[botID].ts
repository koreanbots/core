import { NextApiRequest } from 'next'
import RequestHandler from '@utils/RequestHandler'
import { get } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import Yup from '@utils/Yup'
import { VOTE_COOLDOWN } from '@utils/Constants'

const BotVoted = RequestHandler()
	.get(async (req: ApiRequest, res) => {
		const bot = await get.BotAuthorization(req.headers.token)
		if(!bot) return ResponseWrapper(res, { code: 401, version: 1 })
		if(req.query.botID !== bot) return ResponseWrapper(res, { code: 403, version: 1 })
		const userID = await Yup.string().required().validate(req.query.id).then(el => el).catch(() => null)
		if(!userID) return ResponseWrapper(res, { code: 400, version: 1 })
		const result = await get.botVote(userID, bot)
		return res.json({ code: 200, voted: +new Date() < result + VOTE_COOLDOWN })
	})

interface ApiRequest extends NextApiRequest {
  headers: {
    token: string
  }
  query: {
    botID: string
    id: string
  }
}

export default BotVoted