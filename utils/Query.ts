import fetch from 'node-fetch'
import { TLRU } from 'tlru'
import DataLoader from 'dataloader'
import { ActivityType, GuildFeature, GuildMember, User as DiscordUser, UserFlags } from 'discord.js'

import { Bot, Server, User, ListType, List, TokenRegister, BotFlags, DiscordUserFlags, SubmittedBot, DiscordTokenInfo, ServerData, ServerFlags, RawGuild, Nullable } from '@types'
import { botCategories, DiscordEnpoints, imageSafeHost, serverCategories, SpecialEndPoints, VOTE_COOLDOWN } from './Constants'

import knex from './Knex'
import { Bots, Servers } from './Mongo'
import { DiscordBot, getMainGuild } from './DiscordBot'
import { sign, verify } from './Jwt'
import { camoUrl, formData, getYYMMDD, serialize } from './Tools'
import { AddBotSubmit, AddServerSubmit, ManageBot, ManageServer } from './Yup'
import { markdownImage } from './Regex'

export const imageRateLimit = new TLRU<unknown, number>({ maxAgeMs: 60000 })

async function getBot(id: string, topLevel=true):Promise<Bot> {
	const res = await knex('bots')
		.select([
			'id',
			'flags',
			'owners',
			'lib',
			'prefix',
			'votes',
			'servers',
			'shards',
			'intro',
			'desc',
			'web',
			'git',
			'url',
			'category',
			'status',
			'trusted',
			'partnered',
			'discord',
			'state',
			'vanity',
			'bg',
			'banner',
		])
		.where({ id })
		.orWhere({ vanity: id, trusted: true })
		.orWhere({ vanity: id, partnered: true })
	if (res[0]) {
		const discordBot = await DiscordBot.users.fetch(res[0].id).then(r=> r).catch(() => null) as DiscordUser
		if(!discordBot) return null
		const botMember = await getMainGuild()?.members?.fetch(res[0].id).catch(e=> e) as GuildMember
		res[0].flags = res[0].flags | (discordBot.flags?.bitfield & DiscordUserFlags.VERIFIED_BOT ? BotFlags.verified : 0) | (res[0].trusted ? BotFlags.trusted : 0) | (res[0].partnered ? BotFlags.partnered : 0)
		res[0].tag = discordBot.discriminator
		res[0].avatar = discordBot.avatar
		res[0].name = discordBot.username
		res[0].category = JSON.parse(res[0].category)
		res[0].owners = JSON.parse(res[0].owners)
		if(botMember) {
			if(discordBot.flags.has(UserFlags.BotHTTPInteractions)) {
				res[0].status = 'online'
			} else if(!botMember.presence) {
				res[0].status = 'offline'
			} else {
				res[0].status = botMember.presence.activities.some(r => r.type === ActivityType.Streaming) ? 'streaming' : botMember.presence.status
			}
		} else {
			res[0].status = null
		}
		delete res[0].trusted
		delete res[0].partnered
		if (topLevel) {
			res[0].owners = await Promise.all(
				res[0].owners.map(async (u: string) => await get._rawUser.load(u))
			)
			res[0].owners = res[0].owners.filter((el: User | null) => el).map((row: User) => ({ ...row }))
		}

		await knex('bots').update({ name: discordBot.username }).where({ id })

	}

	return res[0] ?? null
}

async function getServer(id: string, topLevel=true): Promise<Server> {
	const res = await knex('servers')
		.select([
			'id',
			'name',
			'flags',
			'intro',
			'desc',
			'votes',
			'owners',
			'category',
			'invite',
			'state',
			'vanity',
			'bg',
			'banner',
			'flags'
		])
		.where({ id })
		.orWhereRaw(`(flags & ${ServerFlags.trusted}) and vanity=?`, [id])
		.orWhereRaw(`(flags & ${ServerFlags.partnered}) and vanity=?`, [id])
	if (res[0]) {
		const data = await getServerData(res[0].id)
		if(!data || (+new Date() - +new Date(data.updatedAt)) > 3 * 60 * 1000) res[0].state = 'unreachable'
		else {
			res[0].flags = res[0].flags | (data.features.includes(GuildFeature.Partnered) && ServerFlags.discord_partnered) | (data.features.includes(GuildFeature.Verified) && ServerFlags.verified)
			if(res[0].owners !== JSON.stringify([data.owner, ...data.admins]) || res[0].name !== data.name)
				await knex('servers').update({ name: data.name, owners: JSON.stringify([data.owner, ...data.admins]) })
					.where({ id: res[0].id })
		}
		delete res[0].owners
		// console.log(data)
		res[0].icon = data?.icon || null
		res[0].members = data?.memberCount || null
		res[0].emojis = data?.emojis || []
		res[0].category = JSON.parse(res[0].category)
		res[0].boostTier = data?.boostTier ?? null
		if(topLevel) {
			res[0].owner = await get._rawUser.load(data?.owner || '') ||  null
			res[0].bots = (await Promise.all(data?.bots.slice(0, 3).map(el => get._rawBot.load(el)) || [])).filter(el => el) || null
		} else {
			res[0].owner = data?.owner || null
			res[0].bots = data?.bots || null
		}
	}
	return res[0] ?? null
}

async function fetchServerOwners(id: string): Promise<User[]|null> {
	const data = await getServerData(id)
	return data ? [ await get._rawUser.load(data.owner), ...(await Promise.all(data.admins.map(el => get._rawUser.load(el)))) ].filter(el => el) : null
}

async function getServerData(id: string): Promise<ServerData|null> {
	return serialize((await Servers.findById(id))?.data || null)
}

async function getUser(id: string, topLevel = true):Promise<User> {
	const res = await knex('users')
		.select(['id', 'flags', 'github'])
		.where({ id })
	if (res[0]) {
		const ownedBots = await knex('bots')
			.select(['id'])
			.where('owners', 'like', `%${id}%`)
			.orderBy('date', 'asc')
		const ownedServer = await knex('servers')
			.select(['id'])
			.where('owners', 'like', `%${id}%`)
			.orderBy('date', 'asc')

		const discordUser = await get.discord.user.load(id)
		res[0].tag = discordUser?.discriminator || '0000'
		res[0].username = discordUser?.username || 'Unknown User'
		if (topLevel) {
			res[0].bots = (await Promise.all(ownedBots.map(async b => await get._rawBot.load(b.id)))).filter((el: Bot | null) => el)
			res[0].servers = (await Promise.all(ownedServer.map(async b => await get._rawServer.load(b.id)))).filter((el: Server | null) => el)
		}
		else {
			res[0].bots = ownedBots.map(el => el.id)
			res[0].servers = ownedServer.map(el => el.id)
		}
	}
	return res[0] || null
}

async function getUserGuilds(id: string): Promise<Nullable<RawGuild[]>> {
	const token = await fetchUserDiscordToken(id)
	if(!token) return null
	const guilds = await fetch(DiscordEnpoints.Guilds, {
		headers: {
			Authorization: `Bearer ${token.access_token}`,
		}
	}).then(r=> r.json())
	if(!Array.isArray(guilds)) return null
	return guilds
}

async function getBotList(type: ListType, page = 1, query?: string):Promise<List<Bot>> {
	let res: { id: string }[]
	let count:string|number
	if (type === 'VOTE') {
		count = (await knex('bots').whereNot({ state: 'blocked' }).count())[0]['count(*)']
		res = await knex('bots')
			.orderBy('votes', 'desc')
			.orderBy('servers', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.whereNot({ state: 'blocked' })
	} else if (type === 'TRUSTED') {
		count = (
			await knex('bots')
				.where({ trusted: true })
				.count()
				.whereNot({ state: 'blocked' })
		)[0]['count(*)']
		res = await knex('bots').whereNot({ state: 'blocked' })
			.where({ trusted: true })
			.orderByRaw('RAND()')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.whereNot({ state: 'blocked' })
	} else if (type === 'NEW') {
		count = (
			await knex('bots').whereNot({ state: 'blocked' })
				.count()
		)[0]['count(*)']
		res = await knex('bots')
			.orderBy('date', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.whereNot({ state: 'blocked' })
	} else if (type === 'PARTNERED') {
		count = (
			await knex('bots')
				.where({ partnered: true }).andWhereNot({ state: 'blocked' })
				.count()
		)[0]['count(*)']
		res = await knex('bots')
			.where({ partnered: true }).andWhereNot({ state: 'blocked' })
			.orderByRaw('RAND()')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'CATEGORY') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		if (!botCategories.includes(query)) throw new Error('알 수 없는 카테고리입니다.')
		count = (
			await knex('bots')
				.where('category', 'like', `%${decodeURI(query)}%`).andWhereNot({ state: 'blocked' })
				.count()
		)[0]['count(*)']
		res = await knex('bots')
			.where('category', 'like', `%${decodeURI(query)}%`).andWhereNot({ state: 'blocked' })
			.orderBy('votes', 'desc')
			.orderBy('servers', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'SEARCH') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		count = (await knex.raw('SELECT count(*) FROM bots WHERE MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode)', [decodeURI(query) + '*']))[0][0]['count(*)']
		res = (await knex.raw('SELECT id, votes, MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode) as relevance FROM bots WHERE MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode) ORDER BY relevance DESC, votes DESC LIMIT 16 OFFSET ?', [decodeURI(query) + '*', decodeURI(query) + '*', ((page ? Number(page) : 1) - 1) * 16]))[0]
	} else {
		count = 1
		res = []
	}

	return { type, data: (await Promise.all(res.map(async el => await getBot(el.id)))).map(r=> ({...r})), currentPage: page, totalPage: Math.ceil(Number(count) / 16) }
}

async function getServerList(type: ListType, page = 1, query?: string):Promise<List<Server>> {
	let res: { id: string }[]
	let count:string|number
	if (type === 'VOTE') {
		count = (await knex('servers').whereNot({ state: 'blocked' }).count())[0]['count(*)']
		res = await knex('servers')
			.orderBy('votes', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.whereNot({ state: 'blocked' })
	} else if (type === 'TRUSTED') {
		count = (
			await knex('servers')
				.whereRaw(`flags & ${ServerFlags.trusted}`)
				.count()
				.whereNot({ state: 'blocked' })
		)[0]['count(*)']
		res = await knex('servers').whereNot({ state: 'blocked' })
			.whereRaw(`flags & ${ServerFlags.trusted}`)
			.orderByRaw('RAND()')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.whereNot({ state: 'blocked' })
	} else if (type === 'NEW') {
		count = (
			await knex('servers').whereNot({ state: 'blocked' })
				.count()
		)[0]['count(*)']
		res = await knex('servers')
			.orderBy('date', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
			.whereNot({ state: 'blocked' })
	} else if (type === 'PARTNERED') {
		count = (
			await knex('servers')
				.whereRaw(`flags & ${ServerFlags.partnered}`)
				.andWhereNot({ state: 'blocked' })
				.count()
		)[0]['count(*)']
		res = await knex('servers')
			.whereRaw(`flags & ${ServerFlags.partnered}`)
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
				.where('category', 'like', `%${decodeURI(query)}%`)
				.andWhereNot({ state: 'blocked' })
				.count()
		)[0]['count(*)']
		res = await knex('servers')
			.where('category', 'like', `%${decodeURI(query)}%`)
			.andWhereNot({ state: 'blocked' })
			.orderBy('votes', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'SEARCH') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		count = (await knex.raw('SELECT count(*) FROM servers WHERE MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode)', [decodeURI(query) + '*']))[0][0]['count(*)']
		res = (await knex.raw('SELECT id, votes, MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode) as relevance FROM servers WHERE MATCH(`name`, `intro`, `desc`) AGAINST(? in boolean mode) ORDER BY relevance DESC, votes DESC LIMIT 16 OFFSET ?', [decodeURI(query)  + '*', decodeURI(query)  + '*', ((page ? Number(page) : 1) - 1) * 16]))[0]
	} else {
		count = 1
		res = []
	}
	return { type, data: (await Promise.all(res.map(async el => await getServer(el.id)))).map(r=> ({...r})), currentPage: page, totalPage: Math.ceil(Number(count) / 16) }
}

async function getBotSubmit(id: string, date: number): Promise<SubmittedBot> {
	const res = await knex('submitted').select(['id', 'date', 'category', 'lib', 'prefix', 'intro', 'desc', 'url', 'web', 'git', 'discord', 'state', 'owners', 'reason']).where({ id, date })
	if(res.length === 0) return null
	res[0].category = JSON.parse(res[0].category)
	res[0].owners = await Promise.all(JSON.parse(res[0].owners).map(async (u: string)=> await get.user.load(u)))
	return res[0]
}

async function getBotSubmits(id: string): Promise<SubmittedBot[]> {
	if(!id) return []
	let res = await knex('submitted').select(['id', 'date', 'category', 'lib', 'prefix', 'intro', 'desc', 'url', 'web', 'git', 'discord', 'state', 'owners', 'reason']).orderBy('date', 'desc').where('owners', 'LIKE', `%${id}%`)
	res = await Promise.all(res.map(async el=> {
		el.category = JSON.parse(el.category)
		el.owners = await Promise.all(JSON.parse(el.owners).map(async (u: string)=> await get.user.load(u)))
		return el
	}))
	return res
}

/**
 * @param userID
 * @param botID
 * @returns Timestamp
 */
async function getVote(userID: string, targetID: string, type: 'bot' | 'server'): Promise<number|null> {
	const user = await knex('users').select(['votes']).where({ id: userID })
	if(user.length === 0) return null
	const data = JSON.parse(user[0].votes)
	return data[`${type}:${targetID}`] || 0
}

async function voteBot(userID: string, botID: string): Promise<number|boolean> {
	const user = await knex('users').select(['votes']).where({ id: userID })
	const key = `bot:${botID}`
	if(user.length === 0) return null
	const date = +new Date()
	const data = JSON.parse(user[0].votes)
	const lastDate = data[key] || 0
	if(date - lastDate < VOTE_COOLDOWN) return VOTE_COOLDOWN - (date - lastDate)
	data[key] = date
	await knex('bots').where({ id: botID }).increment('votes', 1)
	await knex('users').where({ id: userID }).update({ votes: JSON.stringify(data) })
	const record = await Bots.updateOne({ _id: botID, 'voteMetrix.day': getYYMMDD() }, { $inc: { 'voteMetrix.$.increasement': 1, 'voteMetrix.$.count': 1 } })
	if(record.modifiedCount === 0) await Bots.findByIdAndUpdate(botID, { $push: { voteMetrix: { count: (await knex('bots').where({ id: botID }))[0].votes } } }, { upsert: true })
	return true
}

async function voteServer(userID: string, serverID: string): Promise<number|boolean> {
	const user = await knex('users').select(['votes']).where({ id: userID })
	const key = `server:${serverID}`
	if(user.length === 0) return null
	const date = +new Date()
	const data = JSON.parse(user[0].votes)
	const lastDate = data[key] || 0
	if(date - lastDate < VOTE_COOLDOWN) return VOTE_COOLDOWN - (date - lastDate)
	data[key] = date
	await knex('servers').where({ id: serverID }).increment('votes', 1)
	await knex('users').where({ id: userID }).update({ votes: JSON.stringify(data) })
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
async function submitBot(id: string, data: AddBotSubmit):Promise<1|2|3|4|5|SubmittedBot> {
	const submits = await knex('submitted').select(['id']).where({ state: 0 }).andWhere('owners', 'LIKE', `%${id}%`)
	if(submits.length > 1) return 1
	const botId = data.id
	const identicalSubmits = await knex('submitted').select(['id']).where({ id: botId, state: 2 }).whereNotIn('reason', ['PRIVATE', 'OFFLINE', 'ABSENT_AT_DISCORD']) // 다음 사유를 제외한 다른 사유의 3회 이상 거부 존재시 봇 등록 제한.
	if(identicalSubmits.length >= 3) return 5
	const date =  Math.round(+new Date()/1000)
	const sameID = await knex('submitted').select(['id']).where({ id: botId, state: 0 })
	const bot = await get.bot.load(data.id)
	if(sameID.length !== 0 || bot) return 2
	const user = await DiscordBot.users.fetch(data.id)
	if(!user) return 3
	const member = await getMainGuild().members.fetch(id).then(() => true).catch(() => false)
	if(!member) return 4
	await knex('submitted').insert({
		id: botId,
		date: date,
		owners: JSON.stringify([ id ]),
		lib: data.library,
		prefix: data.prefix,
		intro: data.intro,
		desc: data.desc,
		web: data.website,
		git: data.git,
		url: data.url,
		category: JSON.stringify(data.category),
		discord: data.discord,
		state: 0
	})

	return await getBotSubmit(botId, date)
}

/**
 * @returns 1 - Server already exists
 * @returns 2 - Bot not invited
 * @returns 3 - Not owner
 * @returns 4 - Invalid invite code
 */

async function submitServer(userID: string, id: string, data: AddServerSubmit): Promise<1|2|3|4|boolean> {
	const server = await get.server.load(id)
	if(server) return 1
	const serverData = await get.serverData(id)
	if(!serverData) return 2
	if(serverData.owner !== userID && !serverData.admins.includes(userID)) return 3
	const inviteData = await DiscordBot.fetchInvite(data.invite).catch(() => null)
	if(!inviteData || inviteData.guild.id !== id) return 4
	await knex('servers').insert({
		id: id,
		name: serverData.name,
		owners: JSON.stringify([ serverData.owner, ...serverData.admins ]),
		intro: data.intro,
		desc: data.desc,
		category: JSON.stringify(data.category),
		invite: data.invite,
		token: sign({ id }),
	})
	get.server.clear(id)
	return true
}

async function getBotSpec(id: string, userID: string) {
	const res = await knex('bots').select(['id', 'token', 'webhook']).where({ id }).andWhere('owners', 'like', `%${userID}%`)
	if(!res[0]) return null
	return serialize(res[0])
}

async function getServerSpec(id: string, userID: string): Promise<{ id: string, token: string }> {
	const res = await knex('servers').select(['id', 'token']).where({ id }).andWhere('owners', 'like', `%${userID}%`)
	if(!res[0]) return null
	return serialize(res[0])
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
	if(res.length === 0) return 0
	await knex('bots').update({
		prefix: data.prefix,
		lib: data.library,
		web: data.website,
		git: data.git,
		url: data.url,
		discord: data.discord,
		category: JSON.stringify(data.category),
		intro: data.intro,
		desc: data.desc
	}).where({ id })

	return 1
}

async function updatedServer(id: string, data: ManageServer) {
	const res = await knex('servers').where({ id })
	if(res.length === 0) return 0
	await knex('servers').update({
		invite: data.invite,
		category: JSON.stringify(data.category),
		intro: data.intro,
		desc: data.desc
	}).where({ id })

	return 1
}

/**
 * @returns 1 - Limit of 100k servers
 * @returns 2 - Limit of 10M servers
 * @returns 3 - Limit of 100 shards
 */
async function updateServer(id: string, servers: number, shards: number) {
	const bot = await get.bot.load(id)
	if(bot.servers < 10000 && servers >= 10000) return 1
	else if(bot.servers < 1000000 && servers >= 1000000) return 2
	if(bot.shards < 200 && shards >= 200) return 3
	await knex('bots').update({ servers: servers === undefined ? bot.servers : servers, shards: shards === undefined ? bot.shards : shards }).where({ id })
	if(servers) {
		await Bots.findByIdAndUpdate(id, { $pull: { serverMetrix: { day: getYYMMDD() } } }, { upsert: true })
		await Bots.findByIdAndUpdate(id, { $push: { serverMetrix: { count: servers } } })
	}
	return
}

async function updateBotApplication(id: string, value: { webhook: string }) {
	const bot = await knex('bots').update({ webhook: value.webhook }).where({ id })
	if(bot !== 1) return false
	return true
}

async function updateOwner(id: string, owners: string[]): Promise<void> {
	await knex('bots').where({ id }).update({ owners: JSON.stringify(owners) })
	get.bot.clear(id)
}

async function resetBotToken(id: string, beforeToken: string) {
	const token = sign({ id })
	const bot = await knex('bots').update({ token }).where({ id, token: beforeToken })
	if(bot !== 1) return null
	return token
}

async function resetServerToken(id: string, beforeToken: string) {
	const token = sign({ id })
	const server = await knex('servers').update({ token }).where({ id, token: beforeToken })
	if(server !== 1) return null
	return token
}

async function Github(id: string, github: string) {
	const user = await knex('users').where({ github }).whereNot({ id })
	if(github && user.length !== 0) return 0
	await knex('users').update({ github }).where({ id })
	return 1
}

async function getImage(url: string) {
	const res = await fetch(url)
	if(!res.ok) return null
	return await res.buffer()
}

async function getDiscordUser(id: string):Promise<DiscordUser> {
	return await DiscordBot.users.fetch(id, {cache: true}).then(u => u).catch(()=>null)
}

/**
 *
 * @param info
 * @returns 1 - UnVerified
 * @returns 2 - Blocked
 */
async function assignToken(info: TokenRegister):Promise<string|1|2> {
	let token = await knex('users').select(['token', 'perm']).where({ id: info.id || '' })
	let t: string
	if(!info.verified) return 1
	if(token.length === 0) {
		t = sign({ id: info.id }, { expiresIn: '30d' })
		await knex('users').insert({ token: t, date: Math.round(Number(new Date()) / 1000), id: info.id, email: info.email, tag: info.discriminator, username: info.username, discord: sign({ access_token: info.access_token, expires_in: info.expires_in, refresh_token: info.refresh_token })  })
		token = await knex('users').select(['token']).where({ id: info.id })
	} else await knex('users').update({ email: info.email, tag: info.discriminator, username: info.username, discord: sign({ access_token: info.access_token, expires_in: info.expires_in, refresh_token: info.refresh_token }) }).where({ id: info.id })
	if(token[0].perm && token[0].perm !== 'user') return 2
	if(!verify(token[0]?.token ?? '')) {
		t = sign({ id: info.id }, { expiresIn: '30d' })
		await knex('users').update({ token: t }).where({ id: info.id })
	} else t = token[0].token

	return t
}

async function Authorization(token: string):Promise<string|false> {
	const tokenInfo = verify(token ?? '')
	const user = await knex('users').select(['id']).where({ id: tokenInfo?.id ?? '', token: token ?? '' })
	if(user.length === 0) return false
	else return user[0].id
}

async function BotAuthorization(token: string):Promise<string|false> {
	const tokenInfo = verify(token ?? '')
	const bot = await knex('bots').select(['id']).where({ id: tokenInfo?.id ?? '', token: token ?? '' })
	if(bot.length === 0) return false
	else return bot[0].id
}

async function ServerAuthorization(token: string): Promise<string|false> {
	const tokenInfo = verify(token ?? '')
	const server = await knex('servers').select(['id']).where({ id: tokenInfo?.id ?? '', token: token ?? '' })
	if(server.length === 0) return false
	else return server[0].id
}

async function fetchUserDiscordToken(id: string): Promise<DiscordTokenInfo> {
	const res = await knex('users').select(['discord']).where({ id })
	let discord = verify(res[0]?.discord ?? '')
	if(!discord) return null
	if(Date.now() > (discord.iat + discord.expires_in) * 1000) {
		const token: DiscordTokenInfo = await fetch(DiscordEnpoints.Token, {
			method: 'POST',
			body: formData({
				client_id: process.env.DISCORD_CLIENT_ID,
				client_secret: process.env.DISCORD_CLIENT_SECRET,
				refresh_token: discord.refresh_token,
				grant_type: 'refresh_token'
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}).then(r=> r.json())
		if (token.error) return null
		await knex('users').update({ discord: sign({ access_token: token.access_token, expires_in: token.expires_in, refresh_token: token.refresh_token }) }).where({ id })
		discord = token
	}
	return discord
}

async function addRequest(ip: string, map: TLRU<unknown, number>) {
	if(!map.has(ip)) map.set(ip, 0)
	map.set(ip, map.get(ip) + 1)
}

export async function CaptchaVerify(response: string): Promise<boolean> {
	const res:{ success: boolean } = await fetch(SpecialEndPoints.HCaptcha.Verify, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: formData({
			response,
			secret: process.env.HCAPTCHA_KEY
		})
	}).then(r=> r.json())

	return res.success
}

// Private APIs

async function getBotSubmitList() {
	const res = await knex('submitted').select(['id', 'date']).where({ state: 0 })
	return await Promise.all(res.map(b => get.botSubmit.load(JSON.stringify({ id: b.id, date: b.date }))))
}

async function getBotSubmitHistory(id: string): Promise<SubmittedBot[]> {
	const res = await knex('submitted').select(['id', 'date']).where({ id })
	return await Promise.all(res.map(b => get.botSubmit.load(JSON.stringify({ id: b.id, date: b.date }))))
}

async function denyBotSubmission(id: string, date: number, reason?: string) {
	await knex('submitted').update({ state: 2, reason: reason || null }).where({ state: 0, id, date })
}

async function approveBotSubmission(id: string, date: number) {
	const data = await knex('submitted').select(['id', 'date', 'category', 'lib', 'prefix', 'intro', 'desc', 'url', 'web', 'git', 'discord', 'state', 'owners', 'reason']).where({ state: 0, id, date })
	if(!data[0]) return false
	await knex('submitted').where({ state: 0, id, date }).update({ state: 1 })
	await knex('bots').insert({ id, date, owners: data[0].owners, lib: data[0].lib, prefix: data[0].prefix, intro: data[0].intro, desc: data[0].desc, url: data[0].url, web: data[0].web, git: data[0].git, category: data[0].category, discord: data[0].discord, token: sign({ id }) })
	return true
}

export function safeImageHost(text: string) {
	return text?.replace(markdownImage, (matches: string, alt: string|undefined, link: string|undefined, description: string|undefined): string => {
		try {
			const url = new URL(link)
			return `![${alt || description || ''}](${imageSafeHost.find(el => url.host.endsWith(el)) ? link : camoUrl(link) })`
		} catch {
			return matches
		}
	}) || null
}

async function viewBot(id: string) {
	const record = await Bots.updateOne({ _id: id, 'viewMetrix.day': getYYMMDD() }, { $inc: { 'viewMetrix.$.count': 1 } })
	if(record.modifiedCount === 0) await Bots.findByIdAndUpdate(id, { $push: { viewMetrix: { count: 0 } } }, { upsert: true })
}

export const get = {
	discord: {
		user: new DataLoader(
			async (ids: string[]) =>
				(await Promise.all(ids.map(async (id: string) => await getDiscordUser(id))))
			, { cacheMap: new TLRU({ maxStoreSize: 5000, maxAgeMs: 43200000 }) }),
	},
	bot: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getBot(el)))).map(row => serialize(row))
		, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }),
	_rawBot: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getBot(el, false)))).map(row => serialize(row))
		, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }),
	botDescSafe: async (id: string) => {
		const bot = await get.bot.load(id)
		return safeImageHost(bot?.desc)
	},
	server: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (id: string) => await getServer(id)))).map(row => serialize(row))
		, { cacheMap: new TLRU({ maxStoreSize: 5000, maxAgeMs: 60000 }) }),
	_rawServer: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (id: string) => await getServer(id, false)))).map(row => serialize(row))
		, { cacheMap: new TLRU({ maxStoreSize: 5000, maxAgeMs: 60000 }) }),
	user: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getUser(el)))).map(row => serialize(row))
		, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }),
	_rawUser: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getUser(el, false)))).map(row => serialize(row))
		, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }),
	userGuilds: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getUserGuilds(el)))).map(row => serialize(row))
		, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }),
	botSubmits: new DataLoader(
		async (ids: string[]) =>
			(await Promise.all(ids.map(async (el: string) => await getBotSubmits(el)))).map(row => serialize(row))
		, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }),
	botSubmit: new DataLoader(
		async (key: string[]) =>
			(await Promise.all(key.map(async (el: string) => {
				const json = JSON.parse(el)
				return await getBotSubmit(json.id, json.date)
			}))).map(row => serialize(row))
		, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 60000 }) }),
	botSpec: getBotSpec,
	serverSpec: getServerSpec,
	list: {
		category: new DataLoader(
			async (key: string[]) =>
				(await Promise.all(key.map(async (k: string) => {
					const json = JSON.parse(k)
					return await getBotList('CATEGORY', json.page, json.category)
				}))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }),
		search: new DataLoader(
			async (key: string[]) =>
				(await Promise.all(key.map(async (k: string) => {
					const json = JSON.parse(k)
					const res = await getBotList('SEARCH', json.page, json.query)
					return { ...res, totalPage: Number(res.totalPage), currentPage: Number(res.currentPage) }
				}))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }),
		votes: new DataLoader(
			async (pages: number[]) =>
				(await Promise.all(pages.map(async (page: number) => await getBotList('VOTE', page)))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }),
		new: new DataLoader(
			async (pages: number[]) =>
				(await Promise.all(pages.map(async (page: number) => await getBotList('NEW', page)))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 1800000 }) }),
		trusted: new DataLoader(
			async (pages: number[]) =>
				(await Promise.all(pages.map(async (page: number) => await getBotList('TRUSTED', page)))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 3600000 }) }),
	},
	serverList: {
		category: new DataLoader(
			async (key: string[]) =>
				(await Promise.all(key.map(async (k: string) => {
					const json = JSON.parse(k)
					return await getServerList('CATEGORY', json.page, json.category)
				}))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }),
		search: new DataLoader(
			async (key: string[]) =>
				(await Promise.all(key.map(async (k: string) => {
					const json = JSON.parse(k)
					const res = await getServerList('SEARCH', json.page, json.query)
					return { ...res, totalPage: Number(res.totalPage), currentPage: Number(res.currentPage) }
				}))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }),
		votes: new DataLoader(
			async (pages: number[]) =>
				(await Promise.all(pages.map(async (page: number) => await getServerList('VOTE', page)))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 500000 }) }),
		new: new DataLoader(
			async (pages: number[]) =>
				(await Promise.all(pages.map(async (page: number) => await getServerList('NEW', page)))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 1800000 }) }),
		trusted: new DataLoader(
			async (pages: number[]) =>
				(await Promise.all(pages.map(async (page: number) => await getServerList('TRUSTED', page)))).map(row => serialize(row))
			, { cacheMap: new TLRU({ maxStoreSize: 50, maxAgeMs: 3600000 }) }),
	},
	images: {
		user: new DataLoader(
			async (urls: string[]) =>
				(await Promise.all(urls.map(async (url: string) => await getImage(url))))
			, { cacheMap: new TLRU({ maxStoreSize: 500, maxAgeMs: 3600000 }) }),
		server: new DataLoader(
			async (urls: string[]) =>
				(await Promise.all(urls.map(async (url: string) => await getImage(url))))
			, { cacheMap: new TLRU({ maxStoreSize: 500, maxAgeMs: 3600000 }) }),
	},
	serverData: getServerData,
	botVote: async (botID: string, targetID: string) => await getVote(botID, targetID, 'bot'),
	vote: getVote,
	Authorization,
	BotAuthorization,
	ServerAuthorization,
	botSubmitList: getBotSubmitList,
	botSubmitHistory: getBotSubmitHistory,
	serverOwners: fetchServerOwners
}

export const update = {
	assignToken,
	updateBotApplication,
	resetBotToken,
	resetServerToken,
	updateServer,
	Github,
	bot: updateBot,
	server: updatedServer,
	botOwners: updateOwner,
	denyBotSubmission,
	approveBotSubmission,
	fetchUserDiscordToken
}

export const put = {
	voteBot,
	voteServer,
	submitBot,
	submitServer,
	viewBot
}

export const remove = {
	bot: deleteBot,
	server: deleteServer
}

export const ratelimit = {
	image: (ip: string) => {
		addRequest(ip, imageRateLimit)
		return imageRateLimit.get(ip)
	}
}
