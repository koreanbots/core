import { initializeApp } from 'firebase-admin/app'
import { KoreanbotsEndPoints, VOTE_COOLDOWN } from './Constants'
import { get, getNotifications, removeNotification } from './Query'
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
	private firebaseApp = initializeApp()

	public constructor() {
		this.initVotes()
	}

	public async setNotification(userId: string, targetId: string) {
		const noti = await getNotifications(userId, targetId)

		if (!noti) return false
	}

	public async scheduleNotification(noti: Notification) {
		const time = noti.last_voted.getTime() + VOTE_COOLDOWN + 1000 * 60 - Date.now()

		if (time <= 0) {
			return
		}

		this.timeouts[`${noti.user_id}:${noti.target_id}:${noti.token}`] = setTimeout(() => {
			this.pushNotification(noti)
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
				notification: {
					title: '투표 알림',
					body: `${target.name}의 투표가 가능합니다.`,
					imageUrl: image ?? undefined,
				},
				data: {
					url: `/${isBot ? 'bots' : 'servers'}/${noti.target_id}`,
				},
			})
			.catch((e) => {
				if ('code' in e) {
					if (e.code === 'messaging/registration-token-not-registered') {
						removeNotification({
							token: noti.token,
							targetId: null,
						})
					}
				}
			})
	}
}
