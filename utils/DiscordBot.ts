import * as Discord from 'discord.js'

const DiscordBot = new Discord.Client()

const guildID = '653083797763522580'
const reportChannelID = '813255797823766568'

DiscordBot.on('ready', async () => {
	console.log('I\'m Ready')
	await getMainGuild().members.fetch()
	console.log(`Fetched ${getMainGuild().members.cache.size} Members`)
})

DiscordBot.login(process.env.DISCORD_TOKEN)

const getMainGuild = () => DiscordBot.guilds.cache.get(guildID)
const getReportChannel = (): Discord.TextChannel => DiscordBot.channels.cache.get(reportChannelID) as Discord.TextChannel
export { DiscordBot, getMainGuild, getReportChannel }
