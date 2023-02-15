import { APIEmbed, Colors, Snowflake, WebhookClient } from 'discord.js'

import { get, update } from './Query'
import { botWebhookClients } from './DiscordBot'
import { DiscordEnpoints } from './Constants'
import { Bot, Server, WebhookStatus, WebhookType } from '@types'
import { makeDiscordCodeblock } from './Tools'

const sendWebhook = async (payload: WebhookPayload): Promise<boolean> => {
	if(payload.type === 'bot') {
		const id = payload.botId
		const bot = await get.bot.load(id)
		const [webhook, status] = await get.webhook(id, 'bots')
		if(status === 0) return

		if(status === WebhookStatus.Discord){
			if(!botWebhookClients.has(id)) {
				botWebhookClients.set(id, new WebhookClient({
					url: webhook
				}))
			}
			const client = botWebhookClients.get(id)
			const url = new URL(webhook)
			const result = await client.send({
				embeds: [buildEmbed({payload, target: bot})],
				threadId: url.searchParams.get('thread_id') || undefined
			}).catch(r => {
				console.error(r)
			})
			if(!result) {
				await update.webhookStatus(id, 'bots', WebhookStatus.Paused)
			}
		}
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