import fetch from 'node-fetch'

import { Oauth } from '../utils/Constants'
import { getBotReviewerStatus, getDiscordOAuthScope } from '../utils/DiscordOAuth'

jest.mock('node-fetch')

const fetchMock = fetch as jest.MockedFunction<typeof fetch>
const originalEnv = process.env

beforeEach(() => {
	jest.resetAllMocks()
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

test('requests member access and allows consent for the additional scope', () => {
	process.env.DISCORD_SCOPE += ' guilds.members.read'
	const url = new URL(Oauth.discord('client', getDiscordOAuthScope()))
	expect(url.searchParams.get('scope')).toBe('identify email guilds guilds.members.read')
	expect(url.searchParams.get('prompt')).not.toBe('none')
})

test.each(['REVIEW_GUILD_ID', 'REVIEW_ROLE_ID'])('skips sync without %s', async (key) => {
	delete process.env[key]
	expect(getDiscordOAuthScope()).toBe('identify email guilds')
	await expect(getBotReviewerStatus('access-token')).resolves.toBeNull()
	expect(fetchMock).not.toHaveBeenCalled()
})

test.each([
	[['review-role', 'another-role'], true],
	[['another-role'], false],
	[[], false],
])('checks the authenticated member roles %j', async (roles, expected) => {
	fetchMock.mockResolvedValue({
		ok: true,
		status: 200,
		json: async () => ({ roles }),
	} as any)
	await expect(getBotReviewerStatus('access-token')).resolves.toBe(expected)
	expect(fetchMock).toHaveBeenCalledWith(
		'https://discord.com/api/v10/users/@me/guilds/review-guild/member',
		{ headers: { Authorization: 'Bearer access-token' }, timeout: 10000 }
	)
})

test('removes reviewer status when the user is no longer a guild member', async () => {
	fetchMock.mockResolvedValue({ ok: false, status: 404 } as any)
	await expect(getBotReviewerStatus('access-token')).resolves.toBe(false)
})

test.each([401, 403, 429, 500])('does not treat HTTP %i as a missing role', async (status) => {
	fetchMock.mockResolvedValue({ ok: false, status } as any)
	await expect(getBotReviewerStatus('access-token')).rejects.toThrow('Discord member lookup failed')
})

test('propagates network failures', async () => {
	fetchMock.mockRejectedValue(new Error('network failure'))
	await expect(getBotReviewerStatus('access-token')).rejects.toThrow('network failure')
})

test.each([{}, { roles: null }, { roles: [4] }])('rejects malformed members %j', async (member) => {
	fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => member } as any)
	await expect(getBotReviewerStatus('access-token')).rejects.toThrow('invalid roles')
})
