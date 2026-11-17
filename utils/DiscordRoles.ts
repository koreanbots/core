import { DiscordAPIError, RESTJSONErrorCodes } from 'discord.js'

import { DiscordBot } from './DiscordBot'

const mainGuildRoles = {
	botreviewer: 'REVIEW_ROLE_ID',
} as const

export async function hasRoleInMainGuild(
	userID: string,
	role: keyof typeof mainGuildRoles
): Promise<boolean> {
	const guildID = process.env.GUILD_ID
	const roleEnv = mainGuildRoles[role]
	const roleID = process.env[roleEnv]
	if (!guildID) throw new Error('GUILD_ID is required to check main guild roles')
	if (!roleID) throw new Error(`${roleEnv} is required to check the ${role} role`)

	const guild = await DiscordBot.guilds.fetch(guildID)
	try {
		const member = await guild.members.fetch({ user: userID })
		return member.roles.cache.has(roleID)
	} catch (error) {
		if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownMember)
			return false
		throw error
	}
}
