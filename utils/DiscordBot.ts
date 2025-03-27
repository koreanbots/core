import * as Discord from 'discord.js'
import NotificationManager from './NotificationManager'

if (!global.kodl) {
	global.kodl = new Discord.Client({
		intents: Number(process.env.DISCORD_CLIENT_INTENTS ?? 32767),
	})
	global.serverlist = new Discord.Client({
		intents: [],
	})

	console.log('Discord Client is initializing')

	global.kodl.on('ready', async () => {
		console.log('Discord Client is ready')
		await getMainGuild().members.fetch()
		console.log(`Fetched ${getMainGuild().members.cache.size} Members`)
	})

	global.kodl.login(process.env.DISCORD_TOKEN ?? '')
	global.serverlist.login(process.env.DISCORD_SERVERLIST_TOKEN)
}

if (!global.notification) {
	global.notification = new NotificationManager()
}

export const DiscordBot = global.kodl as Discord.Client

export const ServerListDiscordBot = global.serverlist as Discord.Client
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
		noticeLog: new Discord.WebhookClient(
			{ url: process.env.NOTICE_LOG_WEBHOOK_URL ?? dummyURL },
			{ allowedMentions: { parse: [] } }
		),
	},
}

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
