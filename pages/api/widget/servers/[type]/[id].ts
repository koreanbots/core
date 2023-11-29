import { NextApiRequest, NextApiResponse } from 'next'

import ResponseWrapper from '@utils/ResponseWrapper'
import { ServerWidgetOptionsSchema } from '@utils/Yup'

import { badgen } from 'badgen'
import { get } from '@utils/Query'
import { ServerBadgeType, DiscordEnpoints } from '@utils/Constants'
import RequestHandler from '@utils/RequestHandler'

const Widget = RequestHandler().get(async (req: ApiRequest, res: NextApiResponse) => {
	const { id: param, type, style = 'flat', scale = 1, icon = true } = req.query
	const splitted = param.split('.')

	const validated = await ServerWidgetOptionsSchema.validate({
		id: splitted.slice(0, splitted.length - 1).join('.'),
		ext: splitted[splitted.length - 1],
		style,
		type,
		scale,
		icon,
	})
		.then((el) => el)
		.catch((e) => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})

	if (!validated) return

	const data = await get.server.load(validated.id)

	if (!data) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 서버입니다.' })
	const userImage = !data.icon
		? null
		: await get.images.user.load(
				DiscordEnpoints.CDN.guild(data.id, data.icon, { format: 'png', size: 128 })
		  )
	const img =
		userImage ||
		(await get.images.user.load(
			DiscordEnpoints.CDN.default(+data.id % 5, { format: 'png', size: 128 })
		))
	res.setHeader('content-type', 'image/svg+xml; charset=utf-8')
	const badgeData = {
		...ServerBadgeType(data)[type],
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
