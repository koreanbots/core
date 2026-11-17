import knex from '../utils/Knex'
import { hasRoleInMainGuild } from '../utils/DiscordRoles'
import { get, update } from '../utils/Query'
import { TokenRegister, UserFlags } from '../types'

jest.mock('../utils/Knex', () => ({
	__esModule: true,
	default: Object.assign(jest.fn(), { raw: jest.fn((sql, bindings) => ({ sql, bindings })) }),
}))
jest.mock('../utils/DiscordRoles')
jest.mock('../utils/DiscordBot', () => ({}))
jest.mock('../utils/Mongo', () => ({}))
jest.mock('../utils/Jwt', () => ({ sign: () => 'session-token', verify: () => ({ id: 'user' }) }))

const statusMock = hasRoleInMainGuild as jest.MockedFunction<typeof hasRoleInMainGuild>
const userInfo: TokenRegister = {
	id: 'user',
	access_token: 'access-token',
	expires_in: 3600,
	refresh_token: 'refresh-token',
	email: 'user@example.com',
	username: 'user',
	discriminator: '0',
	verified: true,
}
let rows: { token: string; perm: string }[]
let query: {
	select: jest.Mock
	where: jest.Mock
	update: jest.Mock
	insert: jest.Mock
	then: (resolve: (value: typeof rows) => unknown) => Promise<unknown>
}

beforeEach(() => {
	jest.clearAllMocks()
	rows = [{ token: 'session-token', perm: 'user' }]
	query = {
		select: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		update: jest.fn().mockReturnThis(),
		insert: jest.fn().mockImplementation(() => {
			rows = [{ token: 'session-token', perm: 'user' }]
			return query
		}),
		then: (resolve) => Promise.resolve(resolve(rows)),
	}
	;(knex as unknown as jest.Mock).mockReturnValue(query)
	;(knex.raw as jest.Mock).mockImplementation((sql, bindings) => ({ sql, bindings }))
	jest.spyOn(get.user, 'clear')
	jest.spyOn(get._rawUser, 'clear')
})

afterEach(() => jest.restoreAllMocks())

test.each([
	[true, '?? | ?', UserFlags.botreviewer],
	[false, '?? & ?', ~UserFlags.botreviewer],
])('syncs reviewer status %s without replacing other flag bits', async (status, sql, mask) => {
	statusMock.mockResolvedValue(status as boolean)
	await expect(update.assignToken(userInfo)).resolves.toBe('session-token')
	expect(statusMock).toHaveBeenCalledWith('user', 'botreviewer')
	expect(query.where).toHaveBeenCalledWith({ id: 'user' })
	expect(query.update).toHaveBeenCalledWith({ flags: { sql, bindings: ['flags', mask] } })
	expect(get.user.clear).toHaveBeenCalledWith('user')
	expect(get._rawUser.clear).toHaveBeenCalledWith('user')
})

test('also syncs reviewer status for a new account', async () => {
	rows = []
	statusMock.mockResolvedValue(true)
	await expect(update.assignToken(userInfo)).resolves.toBe('session-token')
	expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({ id: 'user' }))
	expect(query.update).toHaveBeenCalledWith({
		flags: { sql: '?? | ?', bindings: ['flags', UserFlags.botreviewer] },
	})
})

test.each(['GUILD_ID', 'REVIEW_ROLE_ID'])('rejects login when %s is missing', async (key) => {
	statusMock.mockRejectedValue(new Error(`${key} is required`))
	await expect(update.assignToken(userInfo)).rejects.toThrow(`${key} is required`)
	expect(query.update).not.toHaveBeenCalled()
	expect(query.insert).not.toHaveBeenCalled()
})

test('does not change the account or issue a login result when role lookup fails', async () => {
	statusMock.mockRejectedValue(new Error('Discord unavailable'))
	await expect(update.assignToken(userInfo)).rejects.toThrow('Discord unavailable')
	expect(query.update).not.toHaveBeenCalled()
	expect(query.insert).not.toHaveBeenCalled()
})

test('rejects blocked accounts before looking up roles', async () => {
	rows[0].perm = 'blocked'
	await expect(update.assignToken(userInfo)).resolves.toBe(2)
	expect(statusMock).not.toHaveBeenCalled()
	expect(query.update).not.toHaveBeenCalled()
})

test('rejects unverified accounts before looking up roles', async () => {
	await expect(update.assignToken({ ...userInfo, verified: false })).resolves.toBe(1)
	expect(statusMock).not.toHaveBeenCalled()
	expect(query.update).not.toHaveBeenCalled()
})
