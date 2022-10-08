import { EmbedBuilder, WebhookClient } from 'discord.js'

import { get, update } from './Query'
import Fetch from './Fetch'

const sendWebhook = async (id: string, type: 'bot' | 'server',  { title, content, data }: WebhookContent): Promise<boolean> => {
	if(type === 'bot') {
		const bot = await get.bot.load(id)
		const webhook = await get.webhook(id, 'bots')[0]
		const status = await get.webhook(id, 'bots')[1]
		if(webhook && Number(status) === 1){
			const baseURL = webhook.split('://', 2)[1]
			if(baseURL.startsWith('discord.com/api/webhooks') || baseURL.startsWith('www.discord.com/api/webhooks')) {
				const client = new WebhookClient({ url: webhook })
				const embed = new EmbedBuilder()
					.setTitle(title)
					.setDescription(content)
					.setColor(3898101)
					.setAuthor({ name: bot.name, iconURL: bot.avatar, url: `https://koreanbots.dev/bots/${id}` })
					.setTimestamp()
				const message = await client.send({
					embeds: [embed]
				})
				if(!message.id) {
					await update.webhookStatus(id, 'bots')
					return false
				}
				return true
			} else {
				const res = await Fetch(webhook, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ...data }),
					credentials: 'omit'
				})
				if(res.code !== 200) {
					await update.webhookStatus(id, 'bots')
					return false
				}
				return true
			}
		}
		else return false
	}
}

interface WebhookContent {
	title: string
	content: string
	data: DataContent
}

interface DataContent {
	before: number
	after: number
	type: 'votes' | 'servers'
}

export default sendWebhook