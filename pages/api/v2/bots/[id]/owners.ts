import { NextApiRequest } from 'next'

import RequestHandler from '@utils/RequestHandler'
import { CaptchaVerify, get, update } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import { EditBotOwner, EditBotOwnerSchema } from '@utils/Yup'
import { User } from '@types'

const BotOwners = RequestHandler()
	.patch(async (req: PostApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const bot = await get.bot.load(req.query.id)
		if(!bot) return ResponseWrapper(res, { code: 404 })
		if((bot.owners as User[])[0].id !== user) return ResponseWrapper(res, { code: 403 })
		const validated = await EditBotOwnerSchema.validate(req.body, { abortEarly: false })
			.then(el => el)
			.catch(e => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})
		if(!validated) return
		const csrfValidated = checkToken(req, res, validated._csrf)
		if (!csrfValidated) return
		const captcha = await CaptchaVerify(validated._captcha)
		if(!captcha) return
		const userFetched: User[] = await Promise.all(validated.owners.map((u: string) => get.user.load(u)))
		if(userFetched.indexOf(null) !== -1) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 유저 ID를 포함하고 있습니다.' })
		if(userFetched.length > 1 && userFetched[0].id !== (bot.owners as User[])[0].id) return ResponseWrapper(res, { code: 400, errors: ['소유자를 이전할 때는 다른 관리자를 포함할 수 없습니다.'] })
		await update.botOwners(bot.id, validated.owners)
		get.user.clear(user)
		return ResponseWrapper(res, { code: 200 })
	})

interface PostApiRequest extends NextApiRequest {
  query: {
    id: string
  },
  body: EditBotOwner
}

export default BotOwners