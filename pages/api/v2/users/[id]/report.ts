import { NextApiRequest} from 'next'
import rateLimit from 'express-rate-limit'

import { get } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { ReportSchema, Report} from '@utils/Yup'
import { getReportChannel } from '@utils/DiscordBot'
import { checkToken } from '@utils/Csrf'

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 3,
	statusCode: 429,
	handler: (_req, res) => ResponseWrapper(res, { code: 429 }),
	keyGenerator: (req) => req.headers['x-forwarded-for'] as string,
	skip: (_req, res) => {
		res.removeHeader('X-RateLimit-Global')
		return false
	}
})

const UserReport = RequestHandler().post(limiter)
	.post(async (req: PostApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if(!user) return ResponseWrapper(res, { code: 401 })
		const userInfo = await get.user.load(req.query.id)
		if(!userInfo) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 유저입니다.' })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if (!csrfValidated) return
		if(!req.body) return ResponseWrapper(res, { code: 400 })
		const validated: Report = await ReportSchema.validate(req.body, { abortEarly: false })
			.then(el => el)
			.catch(e => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})
      
		if(!validated) return
		await getReportChannel().send(`Reported by <@${user}> (${user})\nReported **${userInfo.username}**#${userInfo.tag} <@${userInfo.id}> (${userInfo.id})\nCategory ${req.body.category}\nDesc\n\`\`\`${req.body.description}\`\`\``, { allowedMentions: { parse: ['users'] }})
		return ResponseWrapper(res, { code: 200, message: '성공적으로 처리되었습니다.' })
	})


interface PostApiRequest extends NextApiRequest {
  body: Report | null
  query: {
    id: string
  }
}

export default UserReport 