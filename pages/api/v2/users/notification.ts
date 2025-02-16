import { addNotification, get } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'

const Notification = RequestHandler()
	.get(async (req, res) => {
		const token = req.query.token as string
		const target = req.query.target as string
		const user = await get.Authorization(req.cookies.token)
		if (!user) return res.status(401).json({ code: 401 })

		const result = token
			? await get.notifications.token(token, target)
			: await get.notifications.user(user)

		if (!result) return res.status(400).json({ code: 400 })

		return res.status(200).json({ code: 200, data: result })
	})
	.post(async (req, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return res.status(401).json({ code: 401 })

		const { token, targetId } = req.body

		if (!token || !targetId)
			return res.status(400).json({ code: 400, message: 'Either token or targetId is missing' })

		const result = await addNotification({ token, targetId, userId: user })
		if (typeof result === 'string') return res.status(400).json({ code: 400, message: result })

		return res.status(200).json({ code: 200 })
	})
	.delete(async (req, res) => {
		const user = await get.Authorization(req.cookies.token)

		if (!user) return res.status(401).json({ code: 401 })

		const { token, targetId } = req.body

		if (!token) return res.status(400).json({ code: 400 })

		const result = global.notification.removeNotification({ userId: user, targetId, token })

		if (!result) return res.status(400).json({ code: 400 })

		return res.status(200).json({ code: 200 })
	})

export default Notification
