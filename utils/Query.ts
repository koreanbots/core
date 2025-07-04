import fetch from 'node-fetch'
import { TLRU } from 'tlru'
import DataLoader from 'dataloader'
import { ActivityType, GuildFeature, GuildMember, User as DiscordUser, UserFlags } from 'discord.js'

import {
	Bot,
	Server,
	User,
	ListType,
	List,
	TokenRegister,
	BotFlags,
	DiscordUserFlags,
	SubmittedBot,
	DiscordTokenInfo,
	ServerData,
	ServerFlags,
	RawGuild,
	Nullable,
	Webhook,
	BotSpec,
	ServerSpec,
	ObjectType,
} from '@types'
import {
	botCategories,
	DiscordEnpoints,
	imageSafeHost,
	serverCategories,
	SpecialEndPoints,
	VOTE_COOLDOWN,
} from './Constants'

import knex from './Knex'
import { Bots, Servers } from './Mongo'
import { DiscordBot, getMainGuild } from './DiscordBot'
import { sign, verify } from './Jwt'
import { areArraysEqual, camoUrl, formData, getYYMMDD, serialize } from './Tools'
import { AddBotSubmit, AddServerSubmit, ManageBot, ManageServer } from './Yup'
import { markdownImage } from './Regex'
import { Notification } from './NotificationManager'

export const imageRateLimit = new TLRU<unknown, number>({ maxAgeMs: 60000 })

async function getBot(id: string, topLevel = true): Promise<Bot> {
	const [res] = (await knex('bots')
		.select([
			'bots.id',
			'bots.flags',
			'bots.lib',
			'bots.prefix',
			'bots.votes',
			'bots.servers',
			'bots.shards',
			'bots.intro',
			'bots.desc',
			'bots.web',
			'bots.git',
			'bots.url',
			'bots.category',
			'bots.status',
			'bots.trusted',
			'bots.partnered',
			'bots.enforcements',
			'bots.discord',
			'bots.state',
			'bots.vanity',
			'bots.bg',
			'bots.banner',
			knex.raw('JSON_ARRAYAGG(owners_mapping.user_id) as owners'),
		])
		.leftJoin('owners_mapping', 'bots.id', 'owners_mapping.target_id')
		.where({ 'bots.id': id })
		.orWhere({ vanity: id, trusted: true })
		.orWhere({ vanity: id, partnered: true })
		.groupBy('bots.id')) as any[]

	if (res) {
		const discordBot = await get.discord.user.load(res.id)
		if (!discordBot) {
			return null
		}
		if (Number(discordBot.discriminator) === 0) {
			knex('bots')
				.update({ state: 'deleted' })
				.where({ id })
				.then((r) => r)
		}
		const botMember = (await getMainGuild()
			?.members?.fetch(res.id)
			.catch((e) => e)) as GuildMember
		const name = discordBot.displayName
		res.flags =
			res.flags |
			(discordBot.flags.bitfield & DiscordUserFlags.VERIFIED_BOT ? BotFlags.verified : 0) |
			(res.trusted ? BotFlags.trusted : 0) |
			(res.partnered ? BotFlags.partnered : 0)
		res.tag = discordBot.discriminator
		res.avatar = discordBot.avatar
		res.name = name
		res.category = JSON.parse(res.category)
		res.owners = JSON.parse(res.owners)
		res.banner = res.banner ? camoUrl(res.banner) : null
		res.bg = res.bg ? camoUrl(res.bg) : null
		res.enforcements = JSON.parse(res.enforcements ?? '[]')
		if (discordBot.flags.bitfield & UserFlags.BotHTTPInteractions) {
			res.status = 'online'
		} else if (botMember) {
			if (!botMember.presence) {
				res.status = 'offline'
			} else {
				res.status = botMember.presence.activities.some((r) => r.type === ActivityType.Streaming)
					? 'streaming'
					: botMember.presence.status
			}
		} else {
			res.status = null
		}
		delete res.trusted
		delete res.partnered
		if (topLevel) {
			res.owners = await Promise.all(
				res.owners.map(async (u: string) => await get._rawUser.load(u))
			)
			res.owners = res.owners.filter((el: User | null) => el).map((row: User) => ({ ...row }))
		}

		await knex('bots').update({ name }).where({ id })
	}

	return res ?? null
}

async function getServer(id: string, topLevel = true): Promise<Server> {
	const [res] = (await knex('servers')
		.select([
			'servers.id',
			'servers.name',
			'servers.flags',
			'servers.intro',
			'servers.desc',
			'servers.votes',
			knex.raw('JSON_ARRAYAGG(owners_mapping.user_id) as owners'),
			'servers.category',
			'servers.invite',
			'servers.state',
			'servers.vanity',
			'servers.bg',
			'servers.banner',
			'servers.flags',
		])
		.leftJoin('owners_mapping', 'servers.id', 'owners_mapping.target_id')
		.where({ 'servers.id': id })
		.orWhereRaw(`(servers.flags & ${ServerFlags.trusted}) and servers.vanity=?`, [id])
		.orWhereRaw(`(servers.flags & ${ServerFlags.partnered}) and servers.vanity=?`, [id])
		.groupBy('servers.id')) as any[]

	if (res) {
		const data = await getServerData(res.id)
		res.owners = JSON.parse(res.owners)
		if (!data || +new Date() - +new Date(data.updatedAt) > 3 * 60 * 1000) {
			if (res.state === 'ok') res.state = 'unreachable'
		} else {
			res.flags =
				res.flags |
				(data.features.includes(GuildFeature.Partnered) && ServerFlags.discord_partnered) |
				(data.features.includes(GuildFeature.Verified) && ServerFlags.verified)
			if (res.name !== data.name)
				await knex('servers').update({ name: data.name }).where({ id: res.id })
			if (!areArraysEqual(res.owners, [data.owner, ...data.admins])) {
				updateOwners(res.id, [data.owner, ...data.admins], 'server')
			}
		}
		delete res.owners
		res.icon = data?.icon || null
		res.members = data?.memberCount || null
		res.emojis = data?.emojis || []
		res.category = JSON.parse(res.category)
		res.boostTier = data?.boostTier ?? null
		if (topLevel) {
			res.owner = (await get._rawUser.load(data?.owner || '')) || null
			res.bots =
				(await Promise.all(data?.bots.slice(0, 3).map((el) => get._rawBot.load(el)) || [])).filter(
					(el) => el
				) || null
		} else {
			res.owner = data?.owner || null
			res.bots = data?.bots || null
		}
	}
	return res ?? null
}

async function fetchServerOwners(id: string): Promise<User[] | null> {
	const data = await getServerData(id)
	return data
		? [
				await get._rawUser.load(data.owner),
				...(await Promise.all(data.admins.map((el) => get._rawUser.load(el)))),
		  ].filter((el) => el)
		: null
}

async function getServerData(id: string): Promise<ServerData | null> {
	return serialize((await Servers.findById(id))?.data || null)
}

async function getUser(id: string, topLevel = true): Promise<User> {
	const res = await knex('users').select(['id', 'flags', 'github']).where({ id })
	if (res[0]) {
		const ownedList = await knex('owners_mapping')
			.select(['target_id', 'type'])
			.where({ user_id: id })

		const ownedBots = ownedList.filter((i) => i.type === ObjectType.Bot)
		const ownedServers = ownedList.filter((i) => i.type === ObjectType.Server)

		const discordUser = await get.discord.user.load(id)
		res[0].tag = discordUser?.discriminator || '0000'
		res[0].username = discordUser?.username || 'Unknown User'
		res[0].globalName = discordUser?.displayName || 'Unknown User'
		if (topLevel) {
			res[0].bots = (
				await Promise.all(ownedBots.map(async (b) => await get._rawBot.load(b.target_id)))
			).filter((el: Bot | null) => el)
			res[0].servers = (
				await Promise.all(ownedServers.map(async (b) => await get._rawServer.load(b.target_id)))
			).filter((el: Server | null) => el)
		} else {
			res[0].bots = ownedBots.map((el) => el.target_id)
			res[0].servers = ownedServers.map((el) => el.target_id)
		}
	}
	return res[0] || null
}

async function getUserGuilds(id: string): Promise<Nullable<RawGuild[]>> {
	const token = await fetchUserDiscordToken(id)
	if (!token) return null
	const guilds = await fetch(DiscordEnpoints.Guilds, {
		headers: {
			Authorization: `Bearer ${token.access_token}`,
		},
	}).then((r) => r.json())
	if (!Array.isArray(guilds)) return null
	return guilds
}

async function getBotList(type: ListType, page = 1, query?: string): Promise<List<Bot>> {
	let res: { id: string }[]
	let count: string | number
	if (type === 'VOTE') {
		count = (await knex('bots').where({ state: 'ok' }).count())[0]['count(*)']
		res = await knex('bots')
			.orderBy('votes', 'desc')
			.orderBy('servers', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.where({ state: 'ok' })
	} else if (type === 'TRUSTED') {
		count = (await knex('bots').where({ trusted: true }).count().where({ state: 'ok' }))[0][
			'count(*)'
		]
		res = await knex('bots')
			.where({ state: 'ok' })
			.where({ trusted: true })
			.orderByRaw('RAND()')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.where({ state: 'ok' })
	} else if (type === 'NEW') {
		count = (await knex('bots').where({ state: 'ok' }).count())[0]['count(*)']
		res = await knex('bots')
			.orderBy('date', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.where({ state: 'ok' })
	} else if (type === 'PARTNERED') {
		count = (await knex('bots').where({ partnered: true }).andWhere({ state: 'ok' }).count())[0][
			'count(*)'
		]
		res = await knex('bots')
			.where({ partnered: true })
			.andWhere({ state: 'ok' })
			.orderByRaw('RAND()')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'CATEGORY') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		if (!botCategories.includes(query)) throw new Error('알 수 없는 카테고리입니다.')
		count = (
			await knex('bots')
				.where('category', 'like', `%${decodeURI(query)}%`)
				.andWhere({ state: 'ok' })
				.count()
		)[0]['count(*)']
		res = await knex('bots')
			.where('category', 'like', `%${decodeURI(query)}%`)
			.andWhere({ state: 'ok' })
			.orderBy('votes', 'desc')
			.orderBy('servers', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'SEARCH') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		count = (
			await knex.raw(
				'SELECT count(*) FROM bots WHERE `state` = "ok" AND MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode)',
				[decodeURI(query) + '*']
			)
		)[0][0]['count(*)']
		res = (
			await knex.raw(
				'SELECT id, votes, MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode) as relevance FROM bots WHERE `state` = "ok" AND MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode) ORDER BY relevance DESC, votes DESC LIMIT 8 OFFSET ?',
				[decodeURI(query) + '*', decodeURI(query) + '*', ((page ? Number(page) : 1) - 1) * 8]
			)
		)[0]
	} else {
		count = 1
		res = []
	}

	return {
		type,
		data: (await Promise.all(res.map(async (el) => await getBot(el.id, false)))).map((r) => ({
			...r,
		})),
		currentPage: page,
		totalPage: Math.ceil(Number(count) / (type === 'SEARCH' ? 8 : 16)),
	}
}

async function getServerList(type: ListType, page = 1, query?: string): Promise<List<Server>> {
	let res: { id: string }[]
	let count: string | number
	if (type === 'VOTE') {
		count = (await knex('servers').whereNot({ state: 'blocked' }).count())[0]['count(*)']
		res = await knex('servers')
			.orderBy('votes', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.where('last_updated', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
			.whereNot({ state: 'blocked' })
	} else if (type === 'TRUSTED') {
		count = (
			await knex('servers')
				.whereRaw(`flags & ${ServerFlags.trusted}`)
				.count()
				.where('last_updated', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
				.whereNot({ state: 'blocked' })
		)[0]['count(*)']
		res = await knex('servers')
			.whereNot({ state: 'blocked' })
			.whereRaw(`flags & ${ServerFlags.trusted}`)
			.orderByRaw('RAND()')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.where('last_updated', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
			.whereNot({ state: 'blocked' })
	} else if (type === 'NEW') {
		count = (await knex('servers').whereNot({ state: 'blocked' }).count())[0]['count(*)']
		res = await knex('servers')
			.orderBy('date', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.where('last_updated', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
			.whereNot({ state: 'blocked' })
	} else if (type === 'PARTNERED') {
		count = (
			await knex('servers')
				.whereRaw(`flags & ${ServerFlags.partnered} AND last_updated >= ?`, [
					new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
				])
				.andWhereNot({ state: 'blocked' })
				.count()
		)[0]['count(*)']
		res = await knex('servers')
			.whereRaw(`flags & ${ServerFlags.partnered} AND last_updated >= ?`, [
				new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
			])
			.andWhereNot({ state: 'blocked' })
			.orderByRaw('RAND()')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'CATEGORY') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		if (!serverCategories.includes(query)) throw new Error('알 수 없는 카테고리입니다.')
		count = (
			await knex('servers')
				.where('last_updated', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
				.where('category', 'like', `%${decodeURI(query)}%`)
				.andWhereNot({ state: 'blocked' })
				.count()
		)[0]['count(*)']
		res = await knex('servers')
			.where('category', 'like', `%${decodeURI(query)}%`)
			.where('last_updated', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
			.andWhereNot({ state: 'blocked' })
			.orderBy('votes', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'SEARCH') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		count = (
			await knex.raw(
				'SELECT count(*) FROM servers WHERE `state` != "blocked" AND last_updated >= ? AND MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode)',
				[new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), decodeURI(query) + '*']
			)
		)[0][0]['count(*)']
		res = (
			await knex.raw(
				'SELECT id, votes, MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode) as relevance FROM servers WHERE `state` != "blocked" AND last_updated >= ? AND MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode) ORDER BY relevance DESC, votes DESC LIMIT 8 OFFSET ?',
				[
					decodeURI(query) + '*',
					new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
					decodeURI(query) + '*',
					((page ? Number(page) : 1) - 1) * 8,
				]
			)
		)[0]
	} else {
		count = 1
		res = []
	}
	return {
		type,
		data: (await Promise.all(res.map(async (el) => await getServer(el.id, false)))).map((r) => ({
			...r,
		})),
		currentPage: page,
		totalPage: Math.ceil(Number(count) / (type === 'SEARCH' ? 8 : 16)),
	}
}

async function getBotSubmit(id: string, date: number): Promise<SubmittedBot> {
	const res = await knex('submitted')
		.select([
			'id',
			'date',
			'category',
			'enforcements',
			'lib',
			'prefix',
			'intro',
			'desc',
			'url',
			'web',
			'git',
			'discord',
			'state',
			'owner',
			'reason',
		])
		.where({ id, date })
	if (res.length === 0) return null
	res[0].category = JSON.parse(res[0].category)
	res[0].enforcements = JSON.parse(res[0].enforcements || '[]')
	res[0].owner = await get.user.load(res[0].owner)
	return res[0]
}

async function getBotSubmits(id: string): Promise<SubmittedBot[]> {
	if (!id) return []
	let res = await knex('submitted')
		.select([
			'id',
			'date',
			'category',
			'enforcements',
			'lib',
			'prefix',
			'intro',
			'desc',
			'url',
			'web',
			'git',
			'discord',
			'state',
			'owner',
			'reason',
		])
		.orderBy('date', 'desc')
		.where({ owner: id })
	const owner = await get.user.load(id)
	res = await Promise.all(
		res.map(async (el) => {
			el.category = JSON.parse(el.category)
			el.enforcements = JSON.parse(el.enforcements)
			el.owner = owner
			return el
		})
	)
	return res
}

/**
 * @param userID
 * @param botID
 * @returns Timestamp
 */
async function getVote(
	userID: string,
	targetID: string,
	type: 'bot' | 'server'
): Promise<number | null> {
	const [vote] = await knex('votes')
		.select('last_voted')
		.where({
			user_id: userID,
			target: targetID,
			type: type === 'bot' ? ObjectType.Bot : ObjectType.Server,
		})
	if (!vote) return null
	return vote.last_voted.getTime() || 0
}

async function getWebhook(id: string, type: 'bots' | 'servers'): Promise<Webhook | null> {
	const res = (
		await knex(type)
			.select(['webhook_url', 'webhook_status', 'webhook_failed_since', 'webhook_secret'])
			.where({ id })
	)[0]
	if (!res) return null
	return {
		url: res.webhook_url,
		status: res.webhook_status,
		failedSince: res.webhook_failed_since,
		secret: res.webhook_secret,
	}
}

async function voteBot(userID: string, botID: string): Promise<number | boolean> {
	const [vote] = await knex('votes').select('*').where({ user_id: userID, target: botID })
	const date = new Date()
	if (vote) {
		const lastDate = vote.last_voted.getTime() || 0
		if (date.getTime() - lastDate < VOTE_COOLDOWN)
			return VOTE_COOLDOWN - (date.getTime() - lastDate)
	}

	await knex('bots').where({ id: botID }).increment('votes', 1)

	const votes = await knex('votes')
		.select('id')
		.where({ user_id: userID, target: botID, type: ObjectType.Bot })
	if (votes.length === 0) {
		await knex('votes').insert({
			user_id: userID,
			target: botID,
			type: ObjectType.Bot,
			last_voted: date,
		})
	} else {
		await knex('votes').where({ id: votes[0].id }).update({ last_voted: date })
	}

	global.notification.refresh(userID, botID)

	const record = await Bots.updateOne(
		{ _id: botID, 'voteMetrix.day': getYYMMDD() },
		{ $inc: { 'voteMetrix.$.increasement': 1, 'voteMetrix.$.count': 1 } }
	)
	if (record.matchedCount === 0)
		await Bots.findByIdAndUpdate(
			botID,
			{ $push: { voteMetrix: { count: (await knex('bots').where({ id: botID }))[0].votes } } },
			{ upsert: true }
		)
	return true
}

async function voteServer(userID: string, serverID: string): Promise<number | boolean> {
	const [vote] = await knex('votes').select('*').where({ user_id: userID, target: serverID })
	const date = new Date()
	if (vote) {
		const lastDate = vote.last_voted.getTime() || 0
		if (date.getTime() - lastDate < VOTE_COOLDOWN)
			return VOTE_COOLDOWN - (date.getTime() - lastDate)
	}

	await knex('servers').where({ id: serverID }).increment('votes', 1)
	await knex('votes')
		.insert({ user_id: userID, target: serverID, type: ObjectType.Server, last_voted: date })
		.onConflict(['user_id', 'target', 'type'])
		.merge({ last_voted: date })

	global.notification.refresh(userID, serverID)

	// const record = await Servers.updateOne({ _id: serverID, 'voteMetrix.day': getYYMMDD() }, { $inc: { 'voteMetrix.$.increasement': 1, 'voteMetrix.$.count': 1 } })
	// if(record.n === 0) await Servers.findByIdAndUpdate(serverID, { $push: { voteMetrix: { count: (await knex('servers').where({ id: serverID }))[0].votes } } }, { upsert: true })
	return true
}
/**
 * @returns 1 - Has pending Bots
 * @returns 2 - Already submitted ID
 * @returns 3 - Bot User does not exists
 * @returns 4 - Discord not Joined
 * @returns 5 - 3 or more denies
 * @returns obj - Success
 */
async function submitBot(
	id: string,
	data: AddBotSubmit
): Promise<1 | 2 | 3 | 4 | 5 | SubmittedBot> {
	const submits = await knex('submitted').select(['id']).where({ state: 0, owner: id })
	if (submits.length > 1) return 1
	const botId = data.id
	const strikes = await get.botSubmitStrikes(botId)
	if (strikes >= 3) return 5
	const date = Math.round(+new Date() / 1000)
	const sameID = await knex('submitted').select(['id']).where({ id: botId, state: 0 })
	const bot = await get.bot.load(data.id)
	if (sameID.length !== 0 || bot) return 2
	const user = await DiscordBot.users.fetch(data.id).catch(() => false)
	if (!user) return 3
	const member = await getMainGuild()
		.members.fetch(id)
		.then(() => true)
		.catch(() => false)
	if (!member) return 4
	await knex('submitted').insert({
		id: botId,
		date: date,
		owner: id,
		lib: data.library,
		prefix: data.prefix,
		intro: data.intro,
		desc: data.desc,
		web: data.website,
		git: data.git,
		url: data.url,
		category: JSON.stringify(data.category),
		enforcements: JSON.stringify(data.enforcements),
		discord: data.discord,
		state: 0,
	})

	return await getBotSubmit(botId, date)
}

/**
 * @returns 1 - Server already exists
 * @returns 2 - Bot not invited
 * @returns 3 - Not owner
 * @returns 4 - Invalid invite code
 */

async function submitServer(
	userID: string,
	id: string,
	data: AddServerSubmit
): Promise<1 | 2 | 3 | 4 | boolean> {
	const server = await get.server.load(id)
	if (server) return 1
	const serverData = await get.serverData(id)
	if (!serverData) return 2
	if (serverData.owner !== userID && !serverData.admins.includes(userID)) return 3
	const inviteData = await DiscordBot.fetchInvite(data.invite).catch(() => null)
	if (!inviteData || inviteData.guild.id !== id || inviteData.expiresAt) return 4
	await knex('servers').insert({
		id: id,
		name: serverData.name,
		intro: data.intro,
		desc: data.desc,
		category: JSON.stringify(data.category),
		invite: data.invite,
		token: sign({ id }),
	})
	await updateOwners(id, [serverData.owner, ...serverData.admins], 'server')
	get.server.clear(id)
	return true
}

async function getBotSpec(id: string, userID: string): Promise<BotSpec | null> {
	const res = await knex('bots')
		.select([
			'bots.id',
			'bots.token',
			'bots.webhook_url',
			'bots.webhook_status',
			'bots.banner',
			'bots.bg',
		])
		.leftJoin('owners_mapping', 'bots.id', 'owners_mapping.target_id')
		.where('owners_mapping.user_id', userID)
		.andWhere('owners_mapping.type', ObjectType.Bot)
		.andWhere('bots.id', id)

	if (!res[0]) return null
	return {
		id: res[0].id,
		token: res[0].token,
		webhookURL: res[0].webhook_url,
		webhookStatus: res[0].webhook_status,
		banner: res[0].banner,
		bg: res[0].bg,
	}
}

async function getServerSpec(id: string, userID: string): Promise<ServerSpec | null> {
	const res = await knex('servers')
		.select(['servers.id', 'servers.token', 'servers.webhook_url', 'servers.webhook_status'])
		.leftJoin('owners_mapping', 'servers.id', 'owners_mapping.target_id')
		.where('owners_mapping.user_id', userID)
		.andWhere('owners_mapping.type', ObjectType.Server)
		.andWhere('servers.id', id)

	if (!res[0]) return null
	return {
		id: res[0].id,
		token: res[0].token,
		webhookURL: res[0].webhook_url,
		webhookStatus: res[0].webhook_status,
	}
}

async function deleteBot(id: string): Promise<boolean> {
	const bot = await knex('bots').where({ id }).del()
	get.bot.clear(id)
	return !!bot
}

async function deleteServer(id: string): Promise<boolean> {
	const server = await knex('servers').where({ id }).del()
	return !!server
}

async function updateBot(id: string, data: ManageBot): Promise<number> {
	const res = await knex('bots').where({ id })
	if (res.length === 0) return 0
	await knex('bots')
		.update({
			prefix: data.prefix,
			lib: data.library,
			web: data.website,
			git: data.git,
			url: data.url,
			discord: data.discord,
			category: JSON.stringify(data.category),
			intro: data.intro,
			desc: data.desc,
			vanity: data.vanity,
			enforcements: JSON.stringify(data.enforcements),
			banner: data.banner,
			bg: data.bg,
		})
		.where({ id })

	return 1
}

async function updatedServer(id: string, data: ManageServer) {
	const res = await knex('servers').where({ id })
	if (res.length === 0) return 0
	await knex('servers')
		.update({
			invite: data.invite,
			category: JSON.stringify(data.category),
			intro: data.intro,
			desc: data.desc,
		})
		.where({ id })

	return 1
}

/**
 * @returns 1 - Limit of 100k servers
 * @returns 2 - Limit of 10M servers
 * @returns 3 - Limit of 100 shards
 */
async function updateServer(id: string, servers: number, shards: number) {
	const bot = await get.bot.load(id)
	if (bot.servers < 10000 && servers >= 10000) return 1
	else if (bot.servers < 1000000 && servers >= 1000000) return 2
	if (bot.shards < 200 && shards >= 200) return 3
	await knex('bots')
		.update({
			servers: servers === undefined ? bot.servers : servers,
			shards: shards === undefined ? bot.shards : shards,
		})
		.where({ id })
	if (servers) {
		await Bots.findByIdAndUpdate(
			id,
			{ $pull: { serverMetrix: { day: getYYMMDD() } } },
			{ upsert: true }
		)
		await Bots.findByIdAndUpdate(id, { $push: { serverMetrix: { count: servers } } })
	}
	return
}

async function updateWebhook(id: string, type: 'bots' | 'servers', value: Partial<Webhook>) {
	const res = await knex(type)
		.update({
			webhook_url: value.url,
			webhook_status: value.status,
			webhook_failed_since: value.failedSince,
			webhook_secret: value.secret,
		})
		.where({ id })
	if (res !== 1) return false
	return true
}

async function updateOwners(id: string, owners: string[], type: 'bot' | 'server'): Promise<void> {
	await knex('owners_mapping').where({ target_id: id }).del()
	await knex('owners_mapping').insert(
		owners.map((el) => ({
			user_id: el,
			target_id: id,
			type: type === 'bot' ? ObjectType.Bot : ObjectType.Server,
		}))
	)
	get.bot.clear(id)
}

async function resetBotToken(id: string, beforeToken: string) {
	const token = sign({ id })
	const bot = await knex('bots').update({ token }).where({ id, token: beforeToken })
	if (bot !== 1) return null
	return token
}

async function resetServerToken(id: string, beforeToken: string) {
	const token = sign({ id })
	const server = await knex('servers').update({ token }).where({ id, token: beforeToken })
	if (server !== 1) return null
	return token
}

async function Github(id: string, github: string | null) {
	if (github) {
		const user = await knex('users').where({ github }).whereNot({ id })
		if (user.length !== 0) return 0
	}
	await knex('users').update({ github }).where({ id })
	return 1
}

async function getImage(url: string) {
	const res = await fetch(url)
	if (!res.ok) return null
	return await res.buffer()
}

async function getDiscordUser(id: string): Promise<DiscordUser> {
	return await DiscordBot.users
		.fetch(id)
		.then((u) => u)
		.catch(() => null)
}

/**
 *
 * @param info
 * @returns 1 - UnVerified
 * @returns 2 - Blocked
 */
async function assignToken(info: TokenRegister): Promise<string | 1 | 2> {
	let token = await knex('users')
		.select(['token', 'perm'])
		.where({ id: info.id || '' })
	let t: string
	if (!info.verified) return 1
	if (token.length === 0) {
		t = sign({ id: info.id }, { expiresIn: '30d' })
		await knex('users').insert({
			token: t,
			date: Math.round(Number(new Date()) / 1000),
			id: info.id,
			email: info.email,
			tag: info.discriminator,
			username: info.username,
			discord: sign({
				access_token: info.access_token,
				expires_in: info.expires_in,
				refresh_token: info.refresh_token,
			}),
		})
		token = await knex('users').select(['token']).where({ id: info.id })
	} else
		await knex('users')
			.update({
				email: info.email,
				tag: info.discriminator,
				username: info.username,
				discord: sign({
					access_token: info.access_token,
					expires_in: info.expires_in,
					refresh_token: info.refresh_token,
				}),
			})
			.where({ id: info.id })
	if (token[0].perm && token[0].perm !== 'user') return 2
	if (!verify(token[0]?.token ?? '')) {
		t = sign({ id: info.id }, { expiresIn: '30d' })
		await knex('users').update({ token: t }).where({ id: info.id })
	} else t = token[0].token

	return t
}

async function Authorization(token: string): Promise<string | false> {
	const tokenInfo = verify(token ?? '')
	const user = await knex('users')
		.select(['id'])
		.where({ id: tokenInfo?.id ?? '', token: token ?? '' })
	if (user.length === 0) return false
	else return user[0].id
}

async function BotAuthorization(token: string): Promise<string | false> {
	const tokenInfo = verify(token ?? '')
	const bot = await knex('bots')
		.select(['id'])
		.where({ id: tokenInfo?.id ?? '', token: token ?? '' })
	if (bot.length === 0) return false
	else return bot[0].id
}

async function ServerAuthorization(token: string): Promise<string | false> {
	const tokenInfo = verify(token ?? '')
	const server = await knex('servers')
		.select(['id'])
		.where({ id: tokenInfo?.id ?? '', token: token ?? '' })
	if (server.length === 0) return false
	else return server[0].id
}

async function fetchUserDiscordToken(id: string): Promise<DiscordTokenInfo> {
	const res = await knex('users').select(['discord']).where({ id })
	let discord = verify(res[0]?.discord ?? '')
	if (!discord) return null
	if (Date.now() > (discord.iat + discord.expires_in) * 1000) {
		const token: DiscordTokenInfo = await fetch(DiscordEnpoints.Token, {
			method: 'POST',
			body: formData({
				client_id: process.env.DISCORD_CLIENT_ID,
				client_secret: process.env.DISCORD_CLIENT_SECRET,
				refresh_token: discord.refresh_token,
				grant_type: 'refresh_token',
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}).then((r) => r.json())
		if (token.error) return null
		await knex('users')
			.update({
				discord: sign({
					access_token: token.access_token,
					expires_in: token.expires_in,
					refresh_token: token.refresh_token,
				}),
			})
			.where({ id })
		discord = token
	}
	return discord
}

async function addRequest(ip: string, map: TLRU<unknown, number>) {
	if (!map.has(ip)) map.set(ip, 0)
	map.set(ip, map.get(ip) + 1)
}

export async function CaptchaVerify(response: string): Promise<boolean> {
	const res: { success: boolean } = await fetch(SpecialEndPoints.HCaptcha.Verify, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: formData({
			response,
			secret: process.env.HCAPTCHA_KEY,
		}),
	}).then((r) => r.json())

	return res.success
}

// FCM

export async function addNotification({
	token,
	userId,
	targetId,
}: {
	token: string
	userId: string
	targetId: string
}) {
	const [vote] = await knex('votes').select('id').where({ user_id: userId, target: targetId })

	if (!vote) {
		return 'Vote does not exist'
	}

	const voteId = vote.id

	const { length } = await knex('notifications').select('vote_id').where({ token, vote_id: voteId })

	if (length === 0) {
		await knex('notifications').insert({ token, vote_id: voteId })
	}

	console.log('Notification added to database', token, userId, targetId)

	global.notification.setNotification(token, userId, targetId)

	return true
}

export async function removeNotification({
	token,
	targetId,
}: {
	token: string
	targetId: string | null
}) {
	if (targetId === null) {
		await knex('notifications').delete().where({ token })
		return true
	}

	await knex('notifications')
		.delete()
		.leftJoin('votes', 'votes.id', 'notifications.vote_id')
		.where({
			'notifications.token': token,
			'votes.target': targetId,
		})

	return true
}

/**
 * We consider that multiple devices could listen to the same topic.
 * @param userId
 * @param targetId
 */
export async function getNotifications(userId?: string, targetId?: string) {
	const q = knex('notifications')
		.select([
			'notifications.*',
			'votes.user_id as user_id',
			'votes.target as target_id',
			'votes.type as type',
			'votes.last_voted as last_voted',
		])
		.leftJoin('votes', 'votes.id', 'notifications.vote_id')

	if (userId) q.where('votes.user_id', userId)
	if (targetId) q.where('votes.target', targetId)

	const res = await q

	return res as Notification[]
}

export async function getNotificationsByToken(token: string, targetId?: string) {
	const q = knex('notifications')
		.select([
			'notifications.*',
			'votes.user_id as user_id',
			'votes.target as target_id',
			'votes.type as type',
			'votes.last_voted as last_voted',
		])
		.leftJoin('votes', 'votes.id', 'notifications.vote_id')
		.where('notifications.token', token)

	if (targetId) q.where('votes.target', targetId)

	const [res] = await q

	return res as Notification
}

export async function getNotificationsByUserId(userId: string) {
	const res = await knex('notifications')
		.select([
			'notifications.*',
			'votes.user_id as user_id',
			'votes.target as target_id',
			'votes.type as type',
			'votes.last_voted as last_voted',
		])
		.leftJoin('votes', 'votes.id', 'notifications.vote_id')
		.where('votes.user_id', userId)

	return res as Notification[]
}

// Private APIs

async function getBotSubmitList() {
	const res = await knex('submitted').select(['id', 'date']).where({ state: 0 })
	return await Promise.all(
		res.map((b) => get.botSubmit.load(JSON.stringify({ id: b.id, date: b.date })))
	)
}

async function getBotSubmitHistory(id: string): Promise<SubmittedBot[]> {
	const res = await knex('submitted').select(['id', 'date']).where({ id })
	return await Promise.all(
		res.map((b) => get.botSubmit.load(JSON.stringify({ id: b.id, date: b.date })))
	)
}

async function denyBotSubmission(id: string, date: number, reason?: string) {
	await knex('submitted')
		.update({ state: 2, reason: reason || null })
		.where({ state: 0, id, date })
}

async function getBotSubmitStrikes(id: string) {
	const identicalSubmits = await knex('submitted')
		.select(['id'])
		.where({ id, state: 2 })
		.whereNotIn('reason', ['PRIVATE', 'OFFLINE', 'ABSENT_AT_DISCORD']) // 다음 사유를 제외한 다른 사유의 3회 이상 거부 존재시 봇 등록 제한.
	return identicalSubmits.length
}

async function approveBotSubmission(id: string, date: number) {
	const [data] = await knex('submitted')
		.select([
			'id',
			'date',
			'category',
			'enforcements',
			'lib',
			'prefix',
			'intro',
			'desc',
			'url',
			'web',
			'git',
			'discord',
			'state',
			'owner',
			'reason',
		])
		.where({ state: 0, id, date })
	if (!data) return false
	await knex('submitted').where({ state: 0, id, date }).update({ state: 1 })
	await knex('bots').insert({
		id,
		date,
		lib: data.lib,
		prefix: data.prefix,
		intro: data.intro,
		desc: data.desc,
		url: data.url,
		web: data.web,
		git: data.git,
		category: data.category,
		enforcements: data.enforcements,
		discord: data.discord,
		token: sign({ id }),
	})
	updateOwners(id, [data.owner], 'bot')
	return true
}

export function safeImageHost(text: string) {
	return (
		text?.replace(
			markdownImage,
			(
				matches: string,
				alt: string | undefined,
				link: string | undefined,
				description: string | undefined
			): string => {
				try {
					const url = new URL(link)
					return `![${alt || description || ''}](${
						imageSafeHost.find((el) => url.host.endsWith(el)) ? link : camoUrl(link)
					})`
				} catch {
					return matches
				}
			}
		) || null
	)
}

async function viewBot(id: string) {
	const record = await Bots.updateOne(
		{ _id: id, 'viewMetrix.day': getYYMMDD() },
		{ $inc: { 'viewMetrix.$.count': 1 } }
	)
	if (record.matchedCount === 0)
		await Bots.findByIdAndUpdate(id, { $push: { viewMetrix: { count: 0 } } }, { upsert: true })
}

const _get = {
	discord: {
		user: new DataLoader(
			async (ids: string[]) =>
				await Promise.all(ids.map(async (id: string) => await getDiscordUser(id))),
			{ cacheMap: new TLRU({ maxStoreSize: 5000, maxAgeMs: 43200000 }) }
		),
	},
	bot: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getBot(el)))).map((row) =>
				serialize(row)
			),
		{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }
	),
	_rawBot: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getBot(el, false)))).map((row) =>
				serialize(row)
			),
		{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }
	),
	botDescSafe: async (id: string) => {
		const bot = await get.bot.load(id)
		return safeImageHost(bot?.desc)
	},
	server: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (id: string) => await getServer(id)))).map((row) =>
				serialize(row)
			),
		{ cacheMap: new TLRU({ maxStoreSize: 5000, maxAgeMs: 60000 }) }
	),
	_rawServer: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (id: string) => await getServer(id, false)))).map((row) =>
				serialize(row)
			),
		{ cacheMap: new TLRU({ maxStoreSize: 5000, maxAgeMs: 60000 }) }
	),
	user: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getUser(el)))).map((row) =>
				serialize(row)
			),
		{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }
	),
	_rawUser: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getUser(el, false)))).map((row) =>
				serialize(row)
			),
		{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }
	),
	userGuilds: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getUserGuilds(el)))).map((row) =>
				serialize(row)
			),
		{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }
	),
	botSubmits: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getBotSubmits(el)))).map((row) =>
				serialize(row)
			),
		{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }
	),
	botSubmit: new DataLoader(
		async (key: string[]) =>
			(
				await Promise.all(
					key.map(async (el: string) => {
						const json = JSON.parse(el)
						return await getBotSubmit(json.id, json.date)
					})
				)
			).map((row) => serialize(row)),
		{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }
	),
	botSpec: getBotSpec,
	serverSpec: getServerSpec,
	list: {
		category: new DataLoader(
			async (key: string[]) =>
				(
					await Promise.all(
						key.map(async (k: string) => {
							const json = JSON.parse(k)
							return await getBotList('CATEGORY', json.page, json.category)
						})
					)
				).map((row) => serialize(row)),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }
		),
		search: new DataLoader(
			async (key: string[]) =>
				(
					await Promise.all(
						key.map(async (k: string) => {
							const json = JSON.parse(k)
							const res = await getBotList('SEARCH', json.page, json.query)
							return {
								...res,
								totalPage: Number(res.totalPage),
								currentPage: Number(res.currentPage),
							}
						})
					)
				).map((row) => serialize(row)),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }
		),
		votes: new DataLoader(
			async (pages: number[]) =>
				(await Promise.all(pages.map(async (page: number) => await getBotList('VOTE', page)))).map(
					(row) => serialize(row)
				),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }
		),
		new: new DataLoader(
			async (pages: number[]) =>
				(await Promise.all(pages.map(async (page: number) => await getBotList('NEW', page)))).map(
					(row) => serialize(row)
				),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 1800000 }) }
		),
		trusted: new DataLoader(
			async (pages: number[]) =>
				(
					await Promise.all(pages.map(async (page: number) => await getBotList('TRUSTED', page)))
				).map((row) => serialize(row)),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 3600000 }) }
		),
	},
	serverList: {
		category: new DataLoader(
			async (key: string[]) =>
				(
					await Promise.all(
						key.map(async (k: string) => {
							const json = JSON.parse(k)
							return await getServerList('CATEGORY', json.page, json.category)
						})
					)
				).map((row) => serialize(row)),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }
		),
		search: new DataLoader(
			async (key: string[]) =>
				(
					await Promise.all(
						key.map(async (k: string) => {
							const json = JSON.parse(k)
							const res = await getServerList('SEARCH', json.page, json.query)
							return {
								...res,
								totalPage: Number(res.totalPage),
								currentPage: Number(res.currentPage),
							}
						})
					)
				).map((row) => serialize(row)),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }
		),
		votes: new DataLoader(
			async (pages: number[]) =>
				(
					await Promise.all(pages.map(async (page: number) => await getServerList('VOTE', page)))
				).map((row) => serialize(row)),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }
		),
		new: new DataLoader(
			async (pages: number[]) =>
				(
					await Promise.all(pages.map(async (page: number) => await getServerList('NEW', page)))
				).map((row) => serialize(row)),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 1800000 }) }
		),
		trusted: new DataLoader(
			async (pages: number[]) =>
				(
					await Promise.all(pages.map(async (page: number) => await getServerList('TRUSTED', page)))
				).map((row) => serialize(row)),
			{ cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 3600000 }) }
		),
	},
	images: {
		user: new DataLoader(
			async (urls: string[]) =>
				await Promise.all(urls.map(async (url: string) => await getImage(url))),
			{ cacheMap: new TLRU({ maxStoreSize: 500, maxAgeMs: 3600000 }) }
		),
		server: new DataLoader(
			async (urls: string[]) =>
				await Promise.all(urls.map(async (url: string) => await getImage(url))),
			{ cacheMap: new TLRU({ maxStoreSize: 500, maxAgeMs: 3600000 }) }
		),
	},
	serverData: getServerData,
	webhook: getWebhook,
	botVote: async (botID: string, targetID: string) => await getVote(botID, targetID, 'bot'),
	vote: getVote,
	Authorization,
	BotAuthorization,
	ServerAuthorization,
	botSubmitList: getBotSubmitList,
	botSubmitHistory: getBotSubmitHistory,
	botSubmitStrikes: getBotSubmitStrikes,
	serverOwners: fetchServerOwners,
	notifications: {
		user: getNotificationsByUserId,
		token: getNotificationsByToken,
	},
}

export type CacheManager = typeof _get

if (!global.get) {
	global.get = _get
}

export const get = global.get

export const update = {
	assignToken,
	resetBotToken,
	resetServerToken,
	updateServer,
	Github,
	bot: updateBot,
	server: updatedServer,
	botOwners: (id: string, owners: string[]) => {
		return updateOwners(id, owners, 'bot')
	},
	webhook: updateWebhook,
	denyBotSubmission,
	approveBotSubmission,
	fetchUserDiscordToken,
}

export const put = {
	voteBot,
	voteServer,
	submitBot,
	submitServer,
	viewBot,
}

export const remove = {
	bot: deleteBot,
	server: deleteServer,
}

export const ratelimit = {
	image: (ip: string) => {
		addRequest(ip, imageRateLimit)
		return imageRateLimit.get(ip)
	},
}
