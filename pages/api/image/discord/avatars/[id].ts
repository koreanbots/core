import { NextApiRequest } from 'next'

import ResponseWrapper from '@utils/ResponseWrapper'
import { DiscordEnpoints } from '@utils/Constants'
import { get, ratelimit } from '@utils/Query'
import RateLimitHandler from '@utils/RateLimitHandler'
import { ImageOptionsSchema } from '@utils/Yup'
import RequestHandler from '@utils/RequestHandler'

const Avatar = RequestHandler()
	.get(async(req: ApiRequest, res) => {
		res.setHeader('Access-Control-Allow-Origin', process.env.KOREANBOTS_URL)
		const { imageRateLimit } = await import('@utils/Query')
		const { id: param, size='256' } = req.query
		const rate = ratelimit.image(req.socket.remoteAddress)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const ratelimited = RateLimitHandler(res, { used: rate, limit: 600, reset: (<any>imageRateLimit).scheduler.get(req.socket.remoteAddress).expiry, onLimitExceed: async(res) => {
			const img = await get.images.user.load(DiscordEnpoints.CDN.default(Math.floor(Math.random() * 6), { format: 'png' }))
			res.setHeader('Content-Type', 'image/png')
			res.setHeader('Cache-Control', 'no-cache')
			res.send(img)
		} })
		if(ratelimited) return
		const splitted = param.split('.')
		let ext = splitted[1]
		const id = splitted[0]
		const validated = await ImageOptionsSchema.validate({ id, ext, size }, { abortEarly: false }).then(el=> el).catch(e=> {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})
		if(!validated) return

		const user = await get.discord.user.load(id)
		if(!user) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 유저입니다.' })

		let img = await get.images.user.load(DiscordEnpoints.CDN.user(id, user.avatar, { format: validated.ext === 'gif' && !user.avatar.startsWith('a_') ? 'png' : validated.ext }))
		if(!user.avatar || !img) {
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