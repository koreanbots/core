import { NextApiRequest } from 'next'
import fetch from 'node-fetch'

import { GithubTokenInfo } from '@types'
import { SpecialEndPoints } from '@utils/Constants'
import { OauthCallbackSchema } from '@utils/Yup'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get, update } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'

const Callback = RequestHandler().get(async (req: ApiRequest, res) => {
	const validate = await OauthCallbackSchema.validate(req.query)
		.then(r => r)
		.catch(e => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})

	if (!validate) return

	const user = await get.Authorization(req.cookies.token)
	if (!user) return ResponseWrapper(res, { code: 401 })
	const token: GithubTokenInfo = await fetch(SpecialEndPoints.Github.Token(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET,req.query.code), {
		method: 'POST',
		headers: {
			Accept: 'application/json'
		},
	}).then(r => r.json())
	if (token.error) return ResponseWrapper(res, { code: 400, errors: ['올바르지 않은 코드입니다.'] })
	
	const github: { login: string } = await fetch(SpecialEndPoints.Github.Me, {
		headers: {
			Authorization: `token ${token.access_token}`
		}
	}).then(r => r.json())
	const result = await update.Github(user, github.login)
	if(result === 0) return ResponseWrapper(res, { code: 400, message: '이미 등록되어있는 깃허브 계정입니다.' })
	get.user.clear(user)
	res.redirect(301, '/panel')
})

interface ApiRequest extends NextApiRequest {
	query: {
		code: string
	}
}

export default Callback
