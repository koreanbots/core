import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import ResponseWrapper from '@utils/ResponseWrapper'
import { DiscordEnpoints } from '@utils/Constants'
import { get, ratelimit } from '@utils/Query'
import RateLimitHandler from '@utils/RateLimitHandler'

const Avatar = nc<ApiRequest, NextApiResponse>()
	.get(async(req, res) => {
		const { imageRateLimit } = await import('@utils/Query')
		const rate = ratelimit.image(req.socket.remoteAddress)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const ratelimited = RateLimitHandler(res, { used: rate, limit: 600, reset: (<any>imageRateLimit).scheduler.get(req.socket.remoteAddress).expiry, onLimitExceed: async(res) => {
			const img = await get.images.user.load(DiscordEnpoints.CDN.default(Math.floor(Math.random() * 6), { format: 'png' }))
			res.setHeader('Content-Type', 'image/png')
			img.pipe(res)
		} })
		console.log(ratelimited)
		if(ratelimited) return
		const splitted = req.query.id.split('.')
		let ext = splitted[1]
		const id = splitted[0]
		if(splitted.length !== 2) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 형식입니다.' })
		if(!['webp', 'png', 'gif'].includes(ext)) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 확장자입니다.' })

		const user = await get.discord.user.load(id)
		if(!user) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 유저입니다.' })

		let img = await get.images.user.load(DiscordEnpoints.CDN.user(id, user.avatar, { format: ext === 'gif' && !user.avatar.startsWith('a_') ? 'png' : (ext as Ext) }))
		if(!user.avatar || !img) {
			img = await get.images.user.load(DiscordEnpoints.CDN.default(user.discriminator, { format: 'png' }))
			ext = 'png'
		}


		res.setHeader('Content-Type', `image/${ext}`)
		img.pipe(res)
	})

	

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

type Ext = 'webp' | 'png' | 'gif'

export default Avatar