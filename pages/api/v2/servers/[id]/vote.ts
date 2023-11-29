import { NextApiRequest } from 'next'

import { CaptchaVerify, get, put } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import Yup from '@utils/Yup'
import { VOTE_COOLDOWN } from '@utils/Constants'
import { sendWebhook } from '@utils/Webhook'
import { WebhookType } from '@types'

const ServerVote = RequestHandler()
	.get(async (req: GetApiRequest, res) => {
		const server = await get.ServerAuthorization(req.headers.authorization)
		if (!server) return ResponseWrapper(res, { code: 401 })
		if (req.query.id !== server) return ResponseWrapper(res, { code: 403 })
		const userID = await Yup.string()
			.required()
			.label('userID')
			.validate(req.query.userID)
			.then((el) => el)
			.catch((e) => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})
		if (!userID) return ResponseWrapper(res, { code: 400 })
		const result = await get.vote(userID, server, 'server')
		return ResponseWrapper(res, {
			code: 200,
			data: { voted: +new Date() < result + VOTE_COOLDOWN, lastVote: result },
		})
	})
	.post(async (req: PostApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const server = await get.server.load(req.query.id)
		if (!server) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 서버입니다.' })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if (!csrfValidated) return
		const captcha = await CaptchaVerify(req.body._captcha)
		if (!captcha) return ResponseWrapper(res, { code: 400, message: '캡챠 검증에 실패하였습니다.' })

		const vote = await put.voteServer(user, server.id)
		if (vote === null) return ResponseWrapper(res, { code: 401 })
		else if (vote === true) {
			sendWebhook(server, {
				type: 'server',
				data: {
					guildId: server.id,
					type: WebhookType.HeartChange,
					before: server.votes,
					after: server.votes + 1,
					userId: user,
				},
				timestamp: Date.now(),
			})
			return ResponseWrapper(res, { code: 200 })
		} else return ResponseWrapper(res, { code: 429, data: { retryAfter: vote } })
	})

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

interface GetApiRequest extends ApiRequest {
	query: {
		id: string
		userID: string
	}
}
interface PostApiRequest extends ApiRequest {
	body: {
		_captcha: string
		_csrf: string
	}
}
export default ServerVote
