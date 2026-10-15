import fetch from 'node-fetch'

import { DiscordEnpoints } from './Constants'

export function getDiscordOAuthScope(): string {
	const scopes = (process.env.DISCORD_SCOPE || 'identify email guilds').split(/\s+/)
	if (process.env.REVIEW_GUILD_ID && process.env.REVIEW_ROLE_ID) scopes.push('guilds.members.read')
	return [...new Set(scopes.filter(Boolean))].join(' ')
}

// A missing configuration leaves manually assigned flags unchanged.
export async function getBotReviewerStatus(accessToken: string): Promise<boolean | null> {
	const guildID = process.env.REVIEW_GUILD_ID
	const roleID = process.env.REVIEW_ROLE_ID
	if (!guildID || !roleID) return null

	const response = await fetch(DiscordEnpoints.GuildMember(guildID), {
		headers: { Authorization: `Bearer ${accessToken}` },
		timeout: 10000,
	})
	if (response.status === 404) return false
	if (!response.ok) throw new Error(`Discord member lookup failed (${response.status})`)

	const member = await response.json()
	if (!Array.isArray(member?.roles) || !member.roles.every((role) => typeof role === 'string'))
		throw new Error('Discord member lookup returned invalid roles')

	return member.roles.includes(roleID)
}
