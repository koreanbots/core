import { APIEmbed, ButtonStyle, Colors, ComponentType, DiscordAPIError, parseWebhookURL, Snowflake, WebhookClient } from 'discord.js'

import { get, update } from './Query'
import { DiscordBot, ServerListDiscordBot, webhookClients } from './DiscordBot'
import { DiscordEnpoints } from './Constants'
import fetch, { Response } from 'node-fetch'
import { Bot, Server, WebhookStatus, WebhookType } from '@types'
import { makeBotURL, makeDiscordCodeblock, makeServerURL } from './Tools'
import crypto from 'crypto'

type RelayOptions = {
	dest: string,
	method: 'GET' | 'POST',
	data?: string
	secret: string,
}

function relayedFetch(options: RelayOptions): Promise<Response> {
	console.log(options)
	return fetch(process.env.WEBHOOK_RELAY_URL, {
		method: 'POST',
		body: JSON.stringify(options),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': process.env.WEBHOOK_RELAY_SECRET,
		}
	})
}

const sendFailedMessage = async (target: Bot | Server): Promise<void> => {
	const isBot = 'owners' in target
	const users = isBot ? target.owners : [target.owner]

	for(const user of users) {
		const r = await (isBot ? DiscordBot : ServerListDiscordBot).users.send(typeof user === 'string' ? user : user.id, {
			embeds: [
				{
					title: '웹후크 전송 실패',
					description: `\`\`${target.name}\`\`에 등록된 웹후크 주소가 올바르지 않거나, 제대로 동작하지 않아 비활성화되었습니다.\n` +
					'설정된 웹후크의 주소가 올바른지 확인해주세요.\n' +
					`[관리 패널](https://koreanbots.dev/${isBot ? 'bots' : 'servers'}/${target.id}/edit)에서 설정된 내용을 다시 저장하면 웹후크가 활성화됩니다.\n` +
					(isBot ? '문제가 지속될 경우 본 DM을 통해 문의해주세요.' : '문제가 지속될 경우 한디리 공식 디스코드 서버에서 문의해주세요.'),
					color: Colors.Red
				}
			],
			components: isBot ? [] : [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							label: '공식 디스코드 서버 참가하기',
							style: ButtonStyle.Link,
							url: 'https://discord.gg/koreanlist'
						}
					]
				}
			]
		}).catch(() => null)
		if(r) return
	}
}

export const verifyWebhook = async(webhookURL: string): Promise<string | false | null> => {
	if(parseWebhookURL(webhookURL)) return null
	const secret = crypto.randomUUID()
	const url = new URL(webhookURL)
	url.searchParams.set('secret', secret)
	const result = await relayedFetch({
		dest: url.toString(),
		method: 'GET',
		secret
	}).then(r => {return r.json()})
	const data = result.data ? JSON.parse(result.data) : null
	if(!result.success || data?.secret !== secret) return false
	return secret
}

export const sendWebhook = async (target: Bot | Server, payload: WebhookPayload): Promise<boolean> => {
	const id = target.id
	const isBot = payload.type === 'bot'

	const webhook = await get.webhook(id, isBot ? 'bots' : 'servers')
	if(!webhook) return
	if(webhook.status === 0) return

	if(webhook.status === WebhookStatus.Discord) {
		if(!webhookClients[payload.type].has(id)) {
			webhookClients[payload.type].set(id, new WebhookClient({
				url: webhook.url
			}))
		}
		const client = webhookClients[payload.type].get(id)

		const url = new URL(webhook.url)
		const result = await client.send({
			embeds: [buildEmbed({payload, target})],
			threadId: url.searchParams.get('thread_id') || undefined
		}).catch((r: DiscordAPIError | unknown)=> {
			if(r instanceof DiscordAPIError) {
				if(400 <= r.status && r.status < 500) {
					return false
				}
			}
			return true
		})
		if(!result) {
			await update.webhook(id, isBot ? 'bots' : 'servers', { status: WebhookStatus.Disabled })
			sendFailedMessage(target)
			return false
		}
	} else if(webhook.status === WebhookStatus.HTTP) {
		const result = await relayedFetch({
			dest: webhook.url,
			method: 'POST',
			data: JSON.stringify(payload),
			secret: webhook.secret
		}).then(async r => {
			if(!r.ok) {
				return null
			}
			return r.json()
		}).catch(() => null)
		if(result === null) return

		if(result.success) {
			const data = result.data
			if((200 <= result.status && result.status < 300) && data.length === 0) {
				await update.webhook(id, isBot ? 'bots' : 'servers', { failedSince: null })
				return true
			}
		}

		if(Date.now() - webhook.failedSince > 1000 * 60 * 60 * 24) {
			await update.webhook(id, isBot ? 'bots' : 'servers', {
				status: WebhookStatus.Disabled,
				failedSince: null,
				secret: null
			})
			sendFailedMessage(target)
		} else if(!webhook.failedSince) {
			await update.webhook(id, isBot ? 'bots' : 'servers', {
				failedSince: Date.now()
			})
		}
		return false
	}
}

function compare(before, after) {
	if(before < after) {
		return '<:skinfuckup:929579848358318130>'
	} else if(before === after) {
		return '➖'
	} else {
		return '<:skinfuckdown1:929579821435080744>'
	}
}

function buildEmbed({payload, target}: {payload: WebhookPayload, target: Bot | Server}): APIEmbed {
	const author = 'avatar' in target ? {
		name: target.name,
		icon_url: 
			DiscordEnpoints.CDN.user(target.id, target.avatar, {format: 'png'}),
		url: makeBotURL({id: target.id, vanity: target.vanity})
	} : {
		name: target.name,
		icon_url:
			DiscordEnpoints.CDN.guild(target.id, target.icon, {format: 'png'}),
		url: makeServerURL({id: target.id, vanity: target.vanity})
	}
	const footer = {
		text: '한국 디스코드 리스트',
		icon_url: DiscordBot.user.avatarURL(),
	}
	switch(payload.data.type) {
	case WebhookType.HeartChange:
		return {
			author,
			title: '❤️  하트 수 변동',
			fields: [
				{
					name: '이전',
					value: makeDiscordCodeblock(payload.data.before.toString()),
					inline: true,
				},
				{
					name: '이후',
					value: makeDiscordCodeblock(payload.data.after.toString()),
					inline: true,
				}
			],
			color: 0xCD3E45,
			footer,
			timestamp: new Date().toISOString()
		}
	case WebhookType.ServerCountChange: 
		return {
			author,
			title: '서버 수 변동',
			description: `${payload.data.before} -> ${payload.data.after} (${compare(payload.data.before, payload.data.after)})`,
			color: Colors.Aqua,
			footer,
			timestamp: new Date().toISOString()
		}
	}
}


type WebhookPayload = BotWebhookPayload | ServerWebhookPayload

type ServerWebhookData = HeartChange
type BotWebhookData = HeartChange | ServerCountChange

type ServerWebhookPayload = {
	type: 'server',
	guildId: Snowflake,
	data: ServerWebhookData
}

type BotWebhookPayload = {
	type: 'bot',
	botId: Snowflake,
	data: BotWebhookData
}

type HeartChange = {
	type: WebhookType.HeartChange,
	before: number,
	after: number,
	userId: Snowflake
}

type ServerCountChange = {
	type: WebhookType.ServerCountChange,
	before: number,
	after: number
}