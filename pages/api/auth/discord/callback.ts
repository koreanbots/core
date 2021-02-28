import { NextApiRequest } from 'next'
import fetch from 'node-fetch'
import { serialize } from 'cookie'

import { DiscordEnpoints } from '@utils/Constants'
import { formData } from '@utils/Tools'
import { OauthCallbackSchema } from '@utils/Yup'
import ResponseWrapper from '@utils/ResponseWrapper'
import { DiscordTokenInfo, DiscordUserInfo } from '@types'
import { update } from '@utils/Query'
import { verify } from '@utils/Jwt'
import RequestHandler from '@utils/RequestHandler'

const Callback = RequestHandler().get(async (req: ApiRequest, res) => {
	const validate = await OauthCallbackSchema.validate(req.query)
		.then(r => r)
		.catch(e => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})

	if (!validate) return

	res.statusCode = 200
	const token: DiscordTokenInfo = await fetch(DiscordEnpoints.Token, {
		method: 'POST',
		body: formData({
			client_id: process.env.DISCORD_CLIENT_ID,
			redirect_uri: process.env.KOREANBOTS_URL + '/api/auth/discord/callback',
			client_secret: process.env.DISCORD_CLIENT_SECRET,
			scope: process.env.DISCORD_SCOPE,
			grant_type: 'authorization_code',
			code: req.query.code,
		}),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).then(r => r.json())
	if (token.error) return ResponseWrapper(res, { code: 400, errors: ['올바르지 않은 코드입니다.'] })

	const user: DiscordUserInfo = await fetch(DiscordEnpoints.Me, {
		method: 'GET',
		headers: {
			Authorization: `${token.token_type} ${token.access_token}`,
		},
	}).then(r => r.json())

	const userToken = await update.assignToken({
		id: user.id,
		access_token: token.access_token,
		expires_in: token.expires_in,
		refresh_token: token.refresh_token,
		email: user.email,
		username: user.username,
		discriminator: user.discriminator,
	})
	const info = verify(userToken)
	res.setHeader(
		'set-cookie',
		serialize('token', userToken, {
			expires: new Date(info.exp * 1000),
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
		})
	)
	res.redirect(301, '/callback/discord')
})

interface ApiRequest extends NextApiRequest {
	query: {
		code: string
	}
}

export default Callback
