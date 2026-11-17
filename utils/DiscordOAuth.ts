export function getDiscordOAuthScope(): string {
	const scopes = (process.env.DISCORD_SCOPE || 'identify email guilds').split(/\s+/)
	return [...new Set(scopes.filter(Boolean))].join(' ')
}
