import * as Discord from 'discord.js'

export const DiscordBot = new Discord.Client({
	intents: Number(process.env.DISCORD_CLIENT_INTENTS ?? 32767),
})

export const ServerListDiscordBot = new Discord.Client({
	intents: [],
})

const dummyURL =
	'https://discord.com/api/webhooks/123123123123123123/asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf'

export const webhookClients = {
	bot: new Discord.Collection<string, Discord.WebhookClient>(),
	server: new Discord.Collection<string, Discord.WebhookClient>(),
	internal: {
		log: new Discord.WebhookClient(
			{ url: process.env.LOG_WEBHOOK_URL ?? dummyURL },
			{ allowedMentions: { parse: [] } }
		),
		reviewLog: new Discord.WebhookClient(
			{ url: process.env.REVIEW_LOG_WEBHOOK_URL ?? dummyURL },
			{ allowedMentions: { parse: [] } }
		),
		openReviewLog: new Discord.WebhookClient(
			{
				url: process.env.OPEN_REVIEW_LOG_WEBHOOK_URL ?? dummyURL,
			},
			{ allowedMentions: { parse: [] } }
		),
		statsLog: new Discord.WebhookClient(
			{ url: process.env.STATS_LOG_WEBHOOK_URL ?? dummyURL },
			{ allowedMentions: { parse: [] } }
		),
		reportChannel: new Discord.WebhookClient(
			{ url: process.env.REPORT_WEBHOOK_URL ?? dummyURL },
			{ allowedMentions: { parse: [] } }
		),
	},
}

DiscordBot.on('ready', async () => {
	console.log('Discord Client is ready')
	await getMainGuild().members.fetch()
	console.log(`Fetched ${getMainGuild().members.cache.size} Members`)
})

DiscordBot.login(process.env.DISCORD_TOKEN ?? '')
ServerListDiscordBot.login(process.env.DISCORD_SERVERLIST_TOKEN)

export const getMainGuild = () => DiscordBot.guilds.cache.get(process.env.GUILD_ID ?? '')

export const discordLog = async (
	type: string,
	issuerID: string,
	embed?: Discord.EmbedBuilder,
	attachment?: { content: string; format: string },
	content?: string
): Promise<void> => {
	webhookClients.internal.log.send({
		content: `[${type}] <@${issuerID}> (${issuerID})\n${content || ''}`,
		embeds: [embed && embed.setTitle(type).setTimestamp(new Date())],
		...(attachment && {
			files: [
				new Discord.AttachmentBuilder(Buffer.from(attachment.content), {
					name: `${type.toLowerCase().replace(/\//g, '-')}-${issuerID}-${Date.now()}.${
						attachment.format
					}`,
				}),
			],
		}),
	})
}
