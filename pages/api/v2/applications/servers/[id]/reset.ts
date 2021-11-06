import { NextApiRequest } from 'next'

import { ResetToken, ResetTokenSchema } from '@utils/Yup'
import { get, update } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import RequestHandler from '@utils/RequestHandler'

const ResetApplication = RequestHandler().post(async (req: ApiRequest, res) => {
	const user = await get.Authorization(req.cookies.token)
	if (!user) return ResponseWrapper(res, { code: 401 })
	const csrfValidated = checkToken(req, res, req.body._csrf)
	if (!csrfValidated) return
	const validated = await ResetTokenSchema.validate(req.body, { abortEarly: false })
		.then(el => el)
		.catch(e => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})

	if (!validated) return
	const server = await get.server.load(req.query.id)
	if (!server) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 서버입니다.' })
	if(server.state === 'unreachable') return ResponseWrapper(res, { code: 400, message: '서버 정보를 불러올 수 없습니다.', errors: ['서버에서 봇이 추방되었거나, 봇이 오프라인이여서 서버 정보를 갱신할 수 없습니다.'] })
	if (!(await get.serverOwners(server.id)).find(el => el.id === user)) return ResponseWrapper(res, { code: 403 })
	const d = await update.resetServerToken(req.query.id, validated.token)
	if (!d) return ResponseWrapper(res, { code: 500, message: '무언가 잘못되었습니다.' })
	return ResponseWrapper(res, { code: 200, data: { token: d } })
})

interface ApiRequest extends NextApiRequest {
	body: ResetToken
	query: {
		id: string
	}
}

export default ResetApplication
