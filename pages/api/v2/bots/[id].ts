import { NextApiRequest } from 'next'

import { get, put } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import { AddBotSubmit, AddBotSubmitSchema } from '@utils/Yup'
import RequestHandler from '@utils/RequestHandler'

const Bots = RequestHandler
	.get(async(req: GetApiRequest, res) => {
		const bot = await get.bot.load(req.query.id)
		if(!bot) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
		else return ResponseWrapper(res, { code: 200, data: bot })
	})
	.post(async (req: PostApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if(!user) return ResponseWrapper(res, { code: 401 })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if(!csrfValidated) return

		const validated = await AddBotSubmitSchema.validate(req.body, { abortEarly: false }).then(el => el).catch(e => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})

		if(!validated) return
		if(validated.id !== req.query.id) return ResponseWrapper(res, { code: 400, errors: ['요청 주소와 Body의 정보가 다릅니다.'] })
		const result = await put.submitBot(user, validated)
		if(result === 1) return ResponseWrapper(res, { code: 403, message: '이미 대기중인 봇이 있습니다.', errors: ['한 번에 최대 2개의 봇까지만 신청하실 수 있습니다.\n다른 봇들의 심사가 완료된 뒤에 신청해주세요.'] })
		else if(result === 2) return ResponseWrapper(res, { code: 406, message: '해당 봇은 이미 심사중이거나 이미 등록되어있습니다.', errors: ['해당 아이디의 봇은 이미 심사중이거나 등록되어있습니다. 본인 소유의 봇이고 신청하신 적이 없으시다면 문의해주세요.'] })
		else if(result === 3) return ResponseWrapper(res, { code: 404, message: '올바르지 않은 봇 아이디입니다.', errors: ['해당 아이디의 봇은 존재하지 않습니다. 다시 확인해주세요.'] })
		else if(result === 4) return ResponseWrapper(res, { code: 403, message: '디스코드 서버에 참가해주세요.' , errors: ['봇 신청하시기 위해서는 공식 디스코드 서버에 참가해주셔야합니다.'] })
		return ResponseWrapper(res, { code: 200, data: result })
	})
	.patch(async (req, res) => {
		return res.send('Reserved')
	})

interface GetApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

interface PostApiRequest extends GetApiRequest {
	body: AddBotSubmit | null
	query: {
		id: string
	}
}

export default Bots