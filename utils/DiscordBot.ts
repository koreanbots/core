import * as Discord from 'discord.js'

export const DiscordBot = new Discord.Client()

const guildID = '653083797763522580'

const reportChannelID = '813255797823766568'
const loggingChannelID = '844006379823955978'
const statsLoggingChannelID = '653227346962153472'

const reviewGuildID = '906537041326637086'
const botReviewLogChannelID = '906551334063439902'
const openBotReviewLogChannelID = '1008376563731013643'

DiscordBot.on('ready', async () => {
	console.log('I\'m Ready')
	await getMainGuild().members.fetch()
	console.log(`Fetched ${getMainGuild().members.cache.size} Members`)
})

DiscordBot.login(process.env.DISCORD_TOKEN)

export const getMainGuild = () => DiscordBot.guilds.cache.get(guildID)
export const getReviewGuild = () => DiscordBot.guilds.cache.get(reviewGuildID)
export const getReportChannel = (): Discord.TextChannel => getMainGuild().channels.cache.get(reportChannelID) as Discord.TextChannel
export const getLoggingChannel = (): Discord.TextChannel => getMainGuild().channels.cache.get(loggingChannelID) as Discord.TextChannel
export const getBotReviewLogChannel = (): Discord.TextChannel => getReviewGuild().channels.cache.get(botReviewLogChannelID) as Discord.TextChannel
export const getStatsLoggingChannel = (): Discord.TextChannel => getMainGuild().channels.cache.get(statsLoggingChannelID) as Discord.TextChannel
export const getOpenBotReviewLogChannel = (): Discord.TextChannel => getReviewGuild().channels.cache.get(openBotReviewLogChannelID) as Discord.TextChannel

export const discordLog = async (type: string, issuerID: string, embed?: Discord.MessageEmbed, attachment?: { content: string, format: string}, content?: string): Promise<void> => {
	getLoggingChannel().send({
		content: `[${type}] <@${issuerID}> (${issuerID})\n${content || ''}`,
		embed: embed && embed.setTitle(type).setTimestamp(new Date()),
		...(attachment && { files: [
			new Discord.MessageAttachment(Buffer.from(attachment.content), `${type.toLowerCase().replace(/\//g, '-')}-${issuerID}-${Date.now()}.${attachment.format}`)
		]
		})
	})
}
