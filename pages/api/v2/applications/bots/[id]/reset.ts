import { NextApiRequest } from 'next'

import { ResetBotToken, ResetBotTokenSchema } from '@utils/Yup'
import { get, update } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import RequestHandler from '@utils/RequestHandler'

import { User } from '@types'

const ResetApplication = RequestHandler().post(async (req: ApiRequest, res) => {
	const user = await get.Authorization(req.cookies.token)
	if (!user) return ResponseWrapper(res, { code: 401 })
	const csrfValidated = checkToken(req, res, req.body._csrf)
	if (!csrfValidated) return
	const validated = await ResetBotTokenSchema.validate(req.body, { abortEarly: false })
		.then(el => el)
		.catch(e => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})

	if (!validated) return
	const bot = await get.bot.load(req.query.id)
	if (!bot) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
	if (!(bot.owners as User[]).find(el => el.id === user)) return ResponseWrapper(res, { code: 403 })
	const d = await update.resetBotToken(req.query.id, validated.token)
	if (!d) return ResponseWrapper(res, { code: 500, message: '무언가 잘못되었습니다.' })
	return ResponseWrapper(res, { code: 200, data: { token: d } })
})

interface ApiRequest extends NextApiRequest {
	body: ResetBotToken
	query: {
		id: string
	}
}

export default ResetApplication
