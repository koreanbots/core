import { initializeApp } from 'firebase-admin/app'
import { KoreanbotsEndPoints, VOTE_COOLDOWN } from './Constants'
import { get, getNotifications, removeNotification as removeNotificationData } from './Query'
import { ObjectType } from '@types'
import { messaging } from 'firebase-admin'

export type Notification = {
	vote_id: number
	token: string
	user_id: string
	target_id: string
	type: ObjectType
	last_voted: Date
}

export default class NotificationManager {
	private timeouts: Record<`${string}:${string}:${string}`, NodeJS.Timeout> = {}
	private firebaseApp: ReturnType<typeof initializeApp>

	public constructor() {
		this.initVotes()
		this.firebaseApp = initializeApp()
		console.log('NotificationManager initialized')
	}

	public async setNotification(token: string, userId: string, targetId: string) {
		const noti = await get.notifications.token(token, targetId)

		if (!noti) return false
		await this.scheduleNotification(noti)
	}

	/**
	 * This is a service. This removes the timeout and the notification data.
	 */
	public async removeNotification({
		userId,
		targetId,
		token,
	}: {
		userId: string
		targetId: string
		token: string
	}): ReturnType<typeof removeNotificationData> {
		console.log('Removing notification for', userId, targetId, token)
		clearTimeout(this.timeouts[`${userId}:${targetId}:${token}`])
		return await removeNotificationData({ targetId, token })
	}

	public async scheduleNotification(noti: Notification) {
		console.log('Scheduling notification for', noti.vote_id)
		const time = noti.last_voted.getTime() + VOTE_COOLDOWN + 1000 * 60 - Date.now()
		console.log('Time:', time)

		if (time <= 0) {
			return
		}

		const key = `${noti.user_id}:${noti.target_id}:${noti.token}`

		this.timeouts[key] = setTimeout(() => {
			this.pushNotification(noti)
			clearTimeout(this.timeouts[key])
		}, time)
	}

	public async refresh(userId: string, targetId: string) {
		const notifications = await getNotifications(userId, targetId)

		for (const noti of notifications) {
			clearTimeout(this.timeouts[`${userId}:${targetId}:${noti.token}`])
			this.scheduleNotification(noti)
		}
	}

	public async initVotes() {
		const res = await getNotifications()
		for (const noti of res) {
			this.scheduleNotification(noti)
		}
	}

	private async pushNotification(noti: Notification) {
		console.log('Pushing notification for', noti.vote_id)
		const isBot = noti.type === ObjectType.Bot
		const target = isBot
			? await get.bot.load(noti.target_id)
			: await get.server.load(noti.target_id)

		const image =
			process.env.KOREANBOTS_URL +
			('avatar' in target
				? KoreanbotsEndPoints.CDN.avatar(target.id, { size: 256 })
				: KoreanbotsEndPoints.CDN.icon(target.id, { size: 256 }))

		await messaging()
			.send({
				token: noti.token,
				data: {
					type: 'vote-available',
					name: target.name,
					imageUrl: image ?? undefined,
					url: `/${isBot ? 'bots' : 'servers'}/${noti.target_id}`,
				},
			})
			.catch((e) => {
				if ('code' in e) {
					if (e.code === 'messaging/registration-token-not-registered') {
						this.removeNotification({
							userId: noti.user_id,
							token: noti.token,
							targetId: null,
						})
					}
				}
			})
	}
}
