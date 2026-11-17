import {
	Client,
	Collection,
	DiscordAPIError,
	GatewayIntentBits,
	RESTJSONErrorCodes,
} from 'discord.js'

import { DiscordBot } from '../utils/DiscordBot'
import { hasRoleInMainGuild } from '../utils/DiscordRoles'

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
		GUILD_ID: 'main-guild',
		REVIEW_GUILD_ID: 'review-guild',
		REVIEW_ROLE_ID: 'review-role',
	}
	guildFetchMock.mockResolvedValue({ members: { fetch: memberFetchMock } })
})

afterEach(() => {
	process.env = originalEnv
})

test.each(['GUILD_ID', 'REVIEW_ROLE_ID'])(
	'rejects missing %s before fetching members',
	async (key) => {
		delete process.env[key]
		await expect(hasRoleInMainGuild('user', 'botreviewer')).rejects.toThrow(`${key} is required`)
		expect(guildFetchMock).not.toHaveBeenCalled()
		expect(memberFetchMock).not.toHaveBeenCalled()
	}
)

test.each([
	[['review-role', 'another-role'], true],
	[['another-role'], false],
	[[], false],
])('checks bot member roles %j', async (roles: string[], expected: boolean) => {
	memberFetchMock.mockResolvedValue({
		roles: { cache: new Collection(roles.map((id) => [id, { id }])) },
	})
	await expect(hasRoleInMainGuild('user', 'botreviewer')).resolves.toBe(expected)
	expect(guildFetchMock).toHaveBeenCalledWith('main-guild')
	expect(memberFetchMock).toHaveBeenCalledWith({ user: 'user' })
})

test('removes reviewer status when the user has left the guild', async () => {
	memberFetchMock.mockRejectedValue(apiError(RESTJSONErrorCodes.UnknownMember, 404))
	await expect(hasRoleInMainGuild('user', 'botreviewer')).resolves.toBe(false)
})

test.each([
	[RESTJSONErrorCodes.UnknownGuild, 404],
	[RESTJSONErrorCodes.MissingAccess, 403],
	[RESTJSONErrorCodes.MissingPermissions, 403],
])('does not treat Discord error %i as a missing role', async (code, status) => {
	const error = apiError(code, status)
	memberFetchMock.mockRejectedValue(error)
	await expect(hasRoleInMainGuild('user', 'botreviewer')).rejects.toBe(error)
})

test('propagates guild lookup failures without looking up the member', async () => {
	const error = apiError(RESTJSONErrorCodes.UnknownGuild, 404)
	guildFetchMock.mockRejectedValue(error)
	await expect(hasRoleInMainGuild('user', 'botreviewer')).rejects.toBe(error)
	expect(memberFetchMock).not.toHaveBeenCalled()
})

test('propagates network failures', async () => {
	const error = new Error('network failure')
	memberFetchMock.mockRejectedValue(error)
	await expect(hasRoleInMainGuild('user', 'botreviewer')).rejects.toBe(error)
})

test('uses the member cache and observes gateway role updates without a REST request', async () => {
	const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] })
	const guildID = '100000000000000001'
	const roleID = '100000000000000002'
	const userID = '100000000000000003'
	process.env.GUILD_ID = guildID
	process.env.REVIEW_ROLE_ID = roleID
	const guild = (client.guilds as any)._add({
		id: guildID,
		name: 'Main guild',
		roles: [
			{ id: guildID, name: '@everyone', permissions: '0' },
			{ id: roleID, name: 'Reviewer', permissions: '0' },
		],
	})
	guild.members._add({
		user: { id: userID, username: 'user', discriminator: '0' },
		joined_at: '2026-01-01T00:00:00Z',
		roles: [roleID],
	})
	guildFetchMock.mockResolvedValue(guild)
	const restGet = jest
		.spyOn(client.rest, 'get')
		.mockRejectedValue(new Error('Unexpected REST request'))
	try {
		await expect(hasRoleInMainGuild(userID, 'botreviewer')).resolves.toBe(true)
		;(client as any).actions.GuildMemberUpdate.handle(
			{ guild_id: guildID, user: { id: userID }, roles: [] },
			{ status: 0 }
		)
		await expect(hasRoleInMainGuild(userID, 'botreviewer')).resolves.toBe(false)
		expect(restGet).not.toHaveBeenCalled()
	} finally {
		restGet.mockRestore()
		await client.destroy()
	}
})
