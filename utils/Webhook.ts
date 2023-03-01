import { APIEmbed, Colors, DiscordAPIError, Snowflake, WebhookClient } from 'discord.js'

import { get, update } from './Query'
import { webhookClients } from './DiscordBot'
import { DiscordEnpoints } from './Constants'
import { Bot, Server, WebhookStatus, WebhookType } from '@types'
import { makeDiscordCodeblock } from './Tools'

const sendWebhook = async (payload: WebhookPayload): Promise<boolean> => {
	let id: Snowflake, target: Bot | Server
	if(payload.type === 'bot') {
		id = payload.botId
		target = await get.bot.load(id)
	} else {
		id = payload.guildId
		target = await get.server.load(id)
	}
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
		).catch(() => null)
		if(!result?.ok) {
			await update.webhookStatus(id, payload.type === 'bot' ? 'bots' : 'servers', WebhookStatus.Disabled)
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
		url: `https://koreanbots/dev/servers/${target.id}`
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
			timestamp: new Date().toISOString()
		}
	case WebhookType.ServerCountChange: 
		return {
			author,
			title: '서버 수 변동',
			description: `${payload.data.before} -> ${payload.data.after} (${compare(payload.data.before, payload.data.after)})`,
			color: Colors.Aqua,
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

export default sendWebhook