import { NextApiRequest } from 'next'

import { CaptchaVerify, get, put } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'

const BotVote = RequestHandler()
	.post(async (req: PostApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if(!user) return ResponseWrapper(res, { code: 401 })
		const bot = await get.bot.load(req.query.id)
		if (!bot) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if (!csrfValidated) return
		const captcha = await CaptchaVerify(req.body._captcha)
		if(!captcha) return ResponseWrapper(res, { code: 400, message: '캡챠 검증에 실패하였습니다.' })

		const vote = await put.voteBot(user, bot.id)
		if(vote === null) return ResponseWrapper(res, { code: 401 })
		else if(vote === true) return ResponseWrapper(res, { code: 200 })
		else return ResponseWrapper(res, { code: 429, data: { retryAfter: vote } })
	})

interface PostApiRequest extends NextApiRequest {
  query: {
    id: string
  }
  body: {
    _captcha: string
    _csrf: string
  }
}

export default BotVote