import { APIEmbed, ButtonStyle, Colors, ComponentType, DiscordAPIError, Snowflake, WebhookClient } from 'discord.js'

import { get, update } from './Query'
import { DiscordBot, ServerListDiscordBot, webhookClients } from './DiscordBot'
import { DiscordEnpoints } from './Constants'
import { Bot, Server, WebhookStatus, WebhookType } from '@types'
import { makeDiscordCodeblock } from './Tools'

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

export const sendWebhook = async (target: Bot | Server, payload: WebhookPayload): Promise<boolean> => {
	const id = target.id

	const [webhook, status] = await get.webhook(id, payload.type === 'bot' ? 'bots' : 'servers')
	if(status === 0) return

	if(status === WebhookStatus.Discord) {
		if(!webhookClients[payload.type].has(id)) {
			webhookClients[payload.type].set(id, new WebhookClient({
				url: webhook
			}))
		}
		const client = webhookClients[payload.type].get(id)

		const url = new URL(webhook)
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
			await update.webhookStatus(id, payload.type === 'bot' ? 'bots' : 'servers', WebhookStatus.Disabled)
			sendFailedMessage(target)
			return false
		}
	} else if(status === WebhookStatus.HTTP) {
		const result = await fetch(
			webhook, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		).then(async r => {
			if(!r.ok) return false
			const text = await r.text()
			if(text.length > 0) return false
			return true
		}).catch(() => false)
		if(!result) {
			await update.webhookStatus(id, payload.type === 'bot' ? 'bots' : 'servers', WebhookStatus.Disabled)
			sendFailedMessage(target)
			return false
		}
	}
	return true
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
		url: `https://koreanbots.dev/bots/${target.id}`
	} : {
		name: target.name,
		icon_url:
			DiscordEnpoints.CDN.guild(target.id, target.icon, {format: 'png'}),
		url: `https://koreanbots.dev/servers/${target.id}`
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