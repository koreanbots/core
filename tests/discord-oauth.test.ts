import { Oauth } from '../utils/Constants'
import { getDiscordOAuthScope } from '../utils/DiscordOAuth'

const originalEnv = process.env

beforeEach(() => {
	process.env = {
		...originalEnv,
		DISCORD_SCOPE: 'identify email guilds',
		REVIEW_GUILD_ID: 'review-guild',
		REVIEW_ROLE_ID: 'review-role',
	}
})

afterEach(() => {
	process.env = originalEnv
})

test('does not request OAuth member access when reviewer sync is configured', () => {
	const url = new URL(Oauth.discord('client', getDiscordOAuthScope()))
	expect(url.searchParams.get('scope')).toBe('identify email guilds')
})

test('preserves explicitly configured scopes without duplicates', () => {
	process.env.DISCORD_SCOPE = ' identify  email guilds identify connections '
	expect(getDiscordOAuthScope()).toBe('identify email guilds connections')
})

test.each([undefined, ''])('uses default scopes when the setting is %s', (scope) => {
	if (scope === undefined) delete process.env.DISCORD_SCOPE
	else process.env.DISCORD_SCOPE = scope
	expect(getDiscordOAuthScope()).toBe('identify email guilds')
})
