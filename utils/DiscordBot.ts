import * as Discord from 'discord.js'

export const DiscordBot = new Discord.Client({
	intents: Number(process.env.DISCORD_CLIENT_INTENTS ?? 32767)
})

export const ServerListDiscordBot = new Discord.Client({
	intents: []
})

export const webhookClients = {
	bot: new Discord.Collection<string, Discord.WebhookClient>(),
	server: new Discord.Collection<string, Discord.WebhookClient>()
}

DiscordBot.on('ready', async () => {
	console.log('I\'m Ready')
	await getMainGuild().members.fetch()
	console.log(`Fetched ${getMainGuild().members.cache.size} Members`)
})

DiscordBot.login(process.env.DISCORD_TOKEN)
ServerListDiscordBot.login(process.env.DISCORD_SERVERLIST_TOKEN)

export const getMainGuild = () => DiscordBot.guilds.cache.get(process.env.GUILD_ID)
export const getReviewGuild = () => DiscordBot.guilds.cache.get(process.env.REVIEW_GUILD_ID)
export const getReportChannel = (): Discord.TextChannel => DiscordBot.channels.cache.get(process.env.REPORT_CHANNEL_ID) as Discord.TextChannel
export const getLoggingChannel = (): Discord.TextChannel => DiscordBot.channels.cache.get(process.env.LOGGING_CHANNEL_ID) as Discord.TextChannel
export const getStatsLoggingChannel = (): Discord.TextChannel => DiscordBot.channels.cache.get(process.env.STATS_LOGGING_CHANNEL_ID) as Discord.TextChannel
export const getBotReviewLogChannel = (): Discord.TextChannel => DiscordBot.channels.cache.get(process.env.REVIEW_LOG_CHANNEL_ID) as Discord.TextChannel
export const getOpenBotReviewLogChannel = (): Discord.TextChannel => DiscordBot.channels.cache.get(process.env.OPEN_REVIEW_LOG_CHANNEL_ID) as Discord.TextChannel

export const discordLog = async (type: string, issuerID: string, embed?: Discord.EmbedBuilder, attachment?: { content: string, format: string}, content?: string): Promise<void> => {
	getLoggingChannel().send({ 
		content: `[${type}] <@${issuerID}> (${issuerID})\n${content || ''}`,
		embeds: [embed && embed.setTitle(type).setTimestamp(new Date())],
		...(attachment && { files: [
			new Discord.AttachmentBuilder(Buffer.from(attachment.content), {name: `${type.toLowerCase().replace(/\//g, '-')}-${issuerID}-${Date.now()}.${attachment.format}`
			})]})
	})
}
