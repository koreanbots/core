import * as Discord from 'discord.js'

const DiscordBot = new Discord.Client()

DiscordBot.login(process.env.DISCORD_TOKEN)

export default DiscordBot