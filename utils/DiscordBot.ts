import * as Discord from 'discord.js'

const DiscordBot = new Discord.Client()

DiscordBot.on('ready', () => console.log('I\'m Ready'))
DiscordBot.login(process.env.DISCORD_TOKEN)

export default DiscordBot