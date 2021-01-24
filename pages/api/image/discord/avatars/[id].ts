import { createReadStream } from 'fs'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import ResponseWrapper from '@utils/ResponseWrapper'
import { DiscordEnpoints } from '@utils/Constants'
import { get } from '@utils/Query'

const Avatar: NextApiHandler = async(req: ApiRequest, res: NextApiResponse) => {
	const splitted = req.query.id.split('.')
	const ext= splitted[1]
	const id = splitted[0]
	if(splitted.length !== 2) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 형식입니다.' })
	if(!['webp', 'png', 'gif'].includes(ext)) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 확장자입니다.' })

	const user = await get.discord.user.load(id)
	if(!user) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 유저입니다.' })

	const image = await get.images.user.load(DiscordEnpoints.CDN.user(id, user.avatar, { format: (ext as Ext) }))
	res.setHeader('Content-Type', `image/${ext}`)
	
	image.pipe(res)
}

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

type Ext = 'webp' | 'png' | 'gif'

export default Avatar