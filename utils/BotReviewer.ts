import { DiscordAPIError, RESTJSONErrorCodes } from 'discord.js'

import { DiscordBot } from './DiscordBot'

// A missing configuration leaves manually assigned flags unchanged.
export async function getBotReviewerStatus(userID: string): Promise<boolean | null> {
	const guildID = process.env.REVIEW_GUILD_ID
	const roleID = process.env.REVIEW_ROLE_ID
	if (!guildID || !roleID) return null

	const guild = await DiscordBot.guilds.fetch(guildID)
	try {
		// Always refresh roles so a removed role cannot survive in the member cache.
		const member = await guild.members.fetch({ user: userID, force: true })
		return member.roles.cache.has(roleID)
	} catch (error) {
		if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownMember)
			return false
		throw error
	}
}
