import { NextApiRequest, NextApiResponse } from 'next'

import ResponseWrapper from '@utils/ResponseWrapper'
import { WidgetOptionsSchema } from '@utils/Yup'

import { badgen } from 'badgen'
import { get } from '@utils/Query'
import { BotBadgeType, DiscordEnpoints } from '@utils/Constants'
import RequestHandler from '@utils/RequestHandler'

const Widget = RequestHandler().get(async (req: ApiRequest, res: NextApiResponse) => {
	const { id: param, type, style = 'flat', scale = 1, icon = true } = req.query
	const splitted = param.split('.')

	const validated = await WidgetOptionsSchema.validate({
		id: splitted.slice(0, splitted.length - 1).join('.'),
		ext: splitted[splitted.length - 1],
		style,
		type,
		scale,
		icon,
	})
		.then(el => el)
		.catch(e => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})

	if (!validated) return

	const data = await get.bot.load(validated.id)

	if (!data) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
	const userImage = !data.avatar
		? null
		: await get.images.user.load(
			DiscordEnpoints.CDN.user(data.id, data.avatar, { format: 'png', size: 128 })
		)
	const img =
		userImage ||
		(await get.images.user.load(
			DiscordEnpoints.CDN.default(data.tag, { format: 'png', size: 128 })
		))
	res.setHeader('content-type', 'image/svg+xml; charset=utf-8')
	const badgeData = {
		...BotBadgeType(data)[type],
		style: validated.style,
		scale: validated.scale,
		icon: validated.icon ? `data:image/png;base64,${img.toString('base64')}` : null,
	}

	res.send(badgen(badgeData))
})

interface ApiRequest extends NextApiRequest {
	query: {
		type: string
		id: string
		style?: string
		scale?: string
		icon?: string
	}
}

export default Widget
