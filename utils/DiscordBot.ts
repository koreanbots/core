import * as Discord from 'discord.js'

const DiscordBot = new Discord.Client()

const guildID = '653083797763522580'
DiscordBot.on('ready', async () => {
	console.log('I\'m Ready')
	await getMainGuild().members.fetch()
	console.log(`Fetched ${getMainGuild().members.cache.size} Members`)
})

DiscordBot.login(process.env.DISCORD_TOKEN)

const getMainGuild = () => DiscordBot.guilds.cache.get(guildID)
export { DiscordBot, getMainGuild }