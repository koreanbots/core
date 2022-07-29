import * as Discord from 'discord.js'

export const DiscordBot = new Discord.Client({
	intents: 32767
})

const guildID = '973239459799789618'

const reportChannelID = '1001512740109684739'
const loggingChannelID = '1001512807776387244'
const statsLoggingChannelID = '1001512883349360680'

const reviewGuildID = '973239459799789618'
const botReviewLogChannelID = '1001513025695645707'

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

export const discordLog = async (type: string, issuerID: string, embed?: Discord.EmbedBuilder, attachment?: { content: string, format: string}, content?: string): Promise<void> => {
	getLoggingChannel().send({ 
		content: `[${type}] <@${issuerID}> (${issuerID})\n${content || ''}`,
		embeds: [embed && embed.setTitle(type).setTimestamp(new Date())],
		...(attachment && { files: [
			new Discord.AttachmentBuilder(Buffer.from(attachment.content), {name: `${type.toLowerCase().replace(/\//g, '-')}-${issuerID}-${Date.now()}.${attachment.format}`
			})]})
	})
}