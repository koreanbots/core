import { Collection, DiscordAPIError, RESTJSONErrorCodes } from 'discord.js'

import { DiscordBot } from '../utils/DiscordBot'
import { getBotReviewerStatus } from '../utils/BotReviewer'

jest.mock('../utils/DiscordBot', () => ({
	DiscordBot: { guilds: { fetch: jest.fn() } },
}))

const guildFetchMock = DiscordBot.guilds.fetch as jest.Mock
const memberFetchMock = jest.fn()
const originalEnv = process.env

function apiError(code: number, status: number) {
	return new DiscordAPIError({ message: 'Lookup failed', code }, code, status, 'GET', '', {})
}

beforeEach(() => {
	jest.resetAllMocks()
	process.env = {
		...originalEnv,
		REVIEW_GUILD_ID: 'review-guild',
		REVIEW_ROLE_ID: 'review-role',
	}
	guildFetchMock.mockResolvedValue({ members: { fetch: memberFetchMock } })
})

afterEach(() => {
	process.env = originalEnv
})

test.each(['REVIEW_GUILD_ID', 'REVIEW_ROLE_ID'])('skips sync without %s', async (key) => {
	delete process.env[key]
	await expect(getBotReviewerStatus('user')).resolves.toBeNull()
	expect(guildFetchMock).not.toHaveBeenCalled()
	expect(memberFetchMock).not.toHaveBeenCalled()
})

test.each([
	[['review-role', 'another-role'], true],
	[['another-role'], false],
	[[], false],
])('checks fresh bot member roles %j', async (roles: string[], expected: boolean) => {
	memberFetchMock.mockResolvedValue({
		roles: { cache: new Collection(roles.map((id) => [id, { id }])) },
	})
	await expect(getBotReviewerStatus('user')).resolves.toBe(expected)
	expect(guildFetchMock).toHaveBeenCalledWith('review-guild')
	expect(memberFetchMock).toHaveBeenCalledWith({ user: 'user', force: true })
})

test('removes reviewer status when the user has left the guild', async () => {
	memberFetchMock.mockRejectedValue(apiError(RESTJSONErrorCodes.UnknownMember, 404))
	await expect(getBotReviewerStatus('user')).resolves.toBe(false)
})

test.each([
	[RESTJSONErrorCodes.UnknownGuild, 404],
	[RESTJSONErrorCodes.MissingAccess, 403],
	[RESTJSONErrorCodes.MissingPermissions, 403],
])('does not treat Discord error %i as a missing role', async (code, status) => {
	const error = apiError(code, status)
	memberFetchMock.mockRejectedValue(error)
	await expect(getBotReviewerStatus('user')).rejects.toBe(error)
})

test('propagates guild lookup failures without looking up the member', async () => {
	const error = apiError(RESTJSONErrorCodes.UnknownGuild, 404)
	guildFetchMock.mockRejectedValue(error)
	await expect(getBotReviewerStatus('user')).rejects.toBe(error)
	expect(memberFetchMock).not.toHaveBeenCalled()
})

test('propagates network failures', async () => {
	const error = new Error('network failure')
	memberFetchMock.mockRejectedValue(error)
	await expect(getBotReviewerStatus('user')).rejects.toBe(error)
})
