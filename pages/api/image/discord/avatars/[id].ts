import { NextApiRequest } from 'next'
import rateLimit from 'express-rate-limit'

import ResponseWrapper from '@utils/ResponseWrapper'
import { DiscordEnpoints } from '@utils/Constants'
import { get } from '@utils/Query'
import { ImageOptionsSchema } from '@utils/Yup'
import RequestHandler from '@utils/RequestHandler'

const rateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 150,
	handler: async (_req, res) => {
		const img = await get.images.user.load(DiscordEnpoints.CDN.default(Math.floor(Math.random() * 6), { format: 'png' }))
		res.setHeader('Content-Type', 'image/png')
		res.setHeader('Cache-Control', 'no-cache')
		res.send(img)
	},
	keyGenerator: (req) => req.headers['x-forwarded-for'] as string,
	skip: (_req, res) => {
		res.removeHeader('X-RateLimit-Global')
		return false
	}
})

const Avatar = RequestHandler()
	.get(rateLimiter)
	.get(async(req: ApiRequest, res) => {
		res.setHeader('Access-Control-Allow-Origin', process.env.KOREANBOTS_URL)
		const { id: param, size='256' } = req.query
		const splitted = param.split('.')
		let ext = splitted[1]
		const id = splitted[0]
		const validated = await ImageOptionsSchema.validate({ id, ext, size }, { abortEarly: false }).then(el=> el).catch(e=> {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})
		if(!validated) return

		const user = await get.discord.user.load(id)
		let img: Buffer
		if(!user?.avatar) img = await get.images.user.load(DiscordEnpoints.CDN.default(user?.discriminator ? Number(user.discriminator) % 5 : Math.floor(Math.random() * 6), { format: 'png', size: validated.size }))
		else img = await get.images.user.load(DiscordEnpoints.CDN.user(id, user.avatar, { format: validated.ext === 'gif' && !user.avatar.startsWith('a_') ? 'png' : validated.ext }))
		if(!img) {
			img = await get.images.user.load(DiscordEnpoints.CDN.default(user.discriminator, { format: 'png', size: validated.size }))
			ext = 'png'
		}


		res.setHeader('Content-Type', `image/${ext}`)
		res.setHeader('Cache-Control', 'public, max-age=86400')
		res.send(img)
	})

	

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
		size?: '128' | '256'  | '512'
	}
}

export default Avatar