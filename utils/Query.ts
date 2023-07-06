import fetch from 'node-fetch'
import { TLRU } from 'tlru'
import DataLoader from 'dataloader'
import { ActivityType, GuildFeature, GuildMember, User as DiscordUser, APIUser as APIDiscordUser, UserFlags } from 'discord.js'

import { Bot, Server, User, ListType, List, TokenRegister, BotFlags, DiscordUserFlags, SubmittedBot, DiscordTokenInfo, ServerData, ServerFlags, RawGuild, Nullable, Webhook, BotSpec, ServerSpec, Library, BotCategory } from '@types'
import { botCategories, DiscordEnpoints, imageSafeHost, serverCategories, SpecialEndPoints, VOTE_COOLDOWN } from './Constants'

import prisma from './Prisma'
import { Bots, Servers } from './Mongo'
import { DiscordBot, getMainGuild } from './DiscordBot'
import { sign, verify } from './Jwt'
import { camoUrl, formData, getYYMMDD, serialize, shuffleArray } from './Tools'
import { AddBotSubmit, AddServerSubmit, ManageBot, ManageServer } from './Yup'
import { markdownImage } from './Regex'
import { servers } from '@prisma/client'

export const imageRateLimit = new TLRU<unknown, number>({ maxAgeMs: 60000 })

async function getBot(id: string, topLevel=true):Promise<Bot> {
	const res = await prisma.bots.findFirst({
		select: {
			id: true,
			flags: true,
			owners: true,
			lib: true,
			prefix: true,
			votes: true,
			servers: true,
			shards: true,
			intro: true,
			desc: true,
			web: true,
			git: true,
			url: true,
			category: true,
			status: true,
			trusted: true,
			partnered: true,
			discord: true,
			state: true,
			vanity: true,
			bg: true,
			banner: true
		},
		where: {
			OR: [
				{ id },
				{ vanity: id, trusted: true },
				{ vanity: id, partnered: true },
			],
		},
	})

	if (!res) return null
	const discordBot = await get.discord._rawUser.load(res.id)
	if(!discordBot) return null
	const botMember = await getMainGuild()?.members?.fetch(res.id).catch(e=> e) as GuildMember
	const name = discordBot.global_name ?? discordBot.username

	const result = {
		... res,
		flags: res.flags | (discordBot.flags & DiscordUserFlags.VERIFIED_BOT ? BotFlags.verified : 0) | (res.trusted ? BotFlags.trusted : 0) | (res.partnered ? BotFlags.partnered : 0),
		tag: discordBot.discriminator,
		avatar: discordBot.avatar,
		name: name,
		category: JSON.parse(res.category),
		owners: JSON.parse(res.owners)
	}

	if(discordBot.flags & UserFlags.BotHTTPInteractions) {
		result.status = 'online'
	} else if(botMember) {
		if(!botMember.presence) {
			result.status = 'offline'
		} else {
			result.status = botMember.presence.activities.some(r => r.type === ActivityType.Streaming)
				? 'streaming'
				: botMember.presence.status === 'invisible'
					? null
					: botMember.presence.status
		}
	} else {
		result.status = null
	}

	if (topLevel) {
		result.owners = await Promise.all(
			result.owners.map(async (u: string) => await get._rawUser.load(u))
		)
		result.owners = result.owners.filter((el: User | null) => el).map((row: User) => ({ ...row }))
	}

	await prisma.bots.update({
		data: { name },
		where: { id }
	})

	return result as Bot ?? null
}

async function getServer(id: string, topLevel=true): Promise<Server> {
	const [res]: servers[] = await prisma.$queryRaw`
		SELECT id, name, flags, intro, \`desc\`, votes, owners, category, invite, state, vanity, bg, banner
		FROM servers
		WHERE id = ${id}
			OR ((flags & ${ServerFlags.trusted}) <> 0 AND vanity = ${id})
			OR ((flags & ${ServerFlags.partnered}) <> 0 AND vanity = ${id})
	`

	if (!res) return null
	const data = await getServerData(res.id)
	if(!data || (+new Date() - +new Date(data.updatedAt)) > 3 * 60 * 1000) {
		if(res.state === 'ok') res.state = 'unreachable'
	} else {
		res.flags = res.flags | (data.features.includes(GuildFeature.Partnered) && ServerFlags.discord_partnered) | (data.features.includes(GuildFeature.Verified) && ServerFlags.verified)
		if(res.owners !== JSON.stringify([data.owner, ...data.admins]) || res.name !== data.name)
			await prisma.servers.update({
				data: {
					name: data.name,
					owners: JSON.stringify([data.owner, ...data.admins])
				},
				where: { id: res.id }
			})
	}
	delete res.owners
	const result = {
		...res,
		icon: data?.icon || null,
		members: data?.memberCount || null,
		emojis:data?.emojis || [],
		category: JSON.parse(res.category),
		boostTier: data?.boostTier ?? null,
		owner: null,
		bots: null
	}

	if(topLevel) {
		result.owner = await get._rawUser.load(data?.owner || '') ||  null
		result.bots = (await Promise.all(data?.bots.slice(0, 3).map(el => get._rawBot.load(el)) || [])).filter(el => el) || null
	} else {
		result.owner = data?.owner || null
		result.bots = data?.bots || null
	}

	return result as Server ?? null
}

async function fetchServerOwners(id: string): Promise<User[]|null> {
	const data = await getServerData(id)
	return data ? [ await get._rawUser.load(data.owner), ...(await Promise.all(data.admins.map(el => get._rawUser.load(el)))) ].filter(el => el) : null
}

async function getServerData(id: string): Promise<ServerData|null> {
	return serialize((await Servers.findById(id))?.data || null)
}

async function getUser(id: string, topLevel = true):Promise<User> {
	const res = await prisma.users.findFirst({
		select: { id: true, flags: true, github: true },
		where: { id }
	})

	if (!res) return null 
	const ownedBots = await prisma.bots.findMany({
		where: { owners: { contains: id } },
		select: { id: true },
		orderBy: { date: 'asc' }
	})

	const ownedServer = await prisma.servers.findMany({
		where: { owners: {	contains: id } },
		select: { id: true },
		orderBy: { date: 'asc' }
	})

	const discordUser = await get.discord._rawUser.load(id)
	const result: User = {
		...res,
		avatar: discordUser?.avatar,
		tag: discordUser?.discriminator || '0000',
		username: discordUser?.username || 'Unknown User',
		globalName: discordUser?.global_name || discordUser?.username || 'Unknown User',
		bots:null,
		servers: null,

	}

	if (topLevel) {
		result.bots = (await Promise.all(ownedBots.map(async b => await get._rawBot.load(b.id)))).filter((el: Bot | null) => el)
		result.servers = (await Promise.all(ownedServer.map(async b => await get._rawServer.load(b.id)))).filter((el: Server | null) => el)
	}
	else {
		result.bots = ownedBots.map(el => el.id)
		result.servers = ownedServer.map(el => el.id)
	}

	return result || null
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
	const res = []
	let count:string|number = 1
	if (type === 'VOTE') {
		count = await prisma.bots.count({ where: { state: { not: 'blocked' } } })
		res.push(await prisma.bots.findMany({
			where: { state: { not: 'blocked' } },
			orderBy: [{ votes: 'desc' }, { servers: 'desc' }],
			take: 16,
			skip: ((page ? Number(page) : 1) - 1) * 16,
			select: { id: true },
		}))
	} else if (type === 'TRUSTED') {
		count = await prisma.bots.count({ where: { trusted: true, state: { not: 'blocked' } } })
		const results = await prisma.bots.findMany({
			select: { id: true },
			where: { state: { not: 'blocked' }, trusted: true },
			take: 16,
			skip: ((page ? Number(page) : 1) - 1) * 16
		})
		res.push(shuffleArray(results)) // prisma가 orderby random을 지원하지 않아 선 호출후 섞는작업
	} else if (type === 'NEW') {
		count = await prisma.bots.count({ where: { state: { not: 'blocked' } } })
		res.push(await prisma.bots.findMany({
			select: { id: true },
			where: { state: { not: 'blocked' } },
			orderBy: { date: 'desc'},
			take: 16,
			skip: ((page ? Number(page) : 1) - 1) * 16
		}))
	} else if (type === 'PARTNERED') {
		count = await prisma.bots.count({ where: { partnered: true, state: { not: 'blocked' } } })
		const results = await prisma.bots.findMany({
			select: { id: true },
			where: {
				partnered: true,
				state: { not: 'blocked' }
			},
			take: 16,
			skip: ((page ? Number(page) : 1) - 1) * 16
		})
		res.push(shuffleArray(results))
	} else if (type === 'CATEGORY') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		if (!botCategories.includes(query)) throw new Error('알 수 없는 카테고리입니다.')

		count = await prisma.bots.count({
			where: {
				category: { contains: decodeURI(query) },
				state: { not: 'blocked' }
			}
		})
		res.push(await prisma.bots.findMany({
			select: { id: true },
			where: {
				category: { contains: decodeURI(query) },
				state: { not: 'blocked' }
			},
			orderBy: [
				{ votes: 'desc' },
				{ servers: 'desc' },
			],
			take: 16,
			skip: ((page ? Number(page) : 1) - 1) * 16
		}))
	} else if (type === 'SEARCH') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		
		count = await prisma.bots.count({
			where: {
				state: { not: 'blocked' },
				OR: [
					{ name: { contains: query } },
					{ intro: { contains: query } },
					{ desc: { contains: query } }
				]
			}
		})
		const results = await prisma.$queryRaw`
			SELECT id, votes, MATCH(name, intro, desc) AGAINST('${decodeURI(query)}*' IN BOOLEAN MODE) as relevance
			FROM bots
			WHERE state != 'blocked' AND MATCH(name, intro, desc) AGAINST('${decodeURI(query)}*' IN BOOLEAN MODE)
			ORDER BY relevance DESC, votes DESC
			LIMIT 16 OFFSET ${((page ? Number(page) : 1) - 1) * 16}`
		res.push(results)
	}

	return { type, data: (await Promise.all(res.map(async el => await getBot(el.id)))).map(r=> ({...r})), currentPage: page, totalPage: Math.ceil(Number(count) / 16) }
}

async function getServerList(type: ListType, page = 1, query?: string):Promise<List<Server>> {
	const res = []
	let count:string|number = 1
	if (type === 'VOTE') {
		count = await prisma.servers.count({ where: { state: { not: 'blocked' } } })
		res.push(prisma.servers.findMany({
			select: { id: true },
			orderBy: { votes: 'desc' },
			where: {
				lastUpdated: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
				state: { not: 'blocked' }
			},
			take: 16,
			skip: ((page ? Number(page) : 1) - 1) * 16
		}))
	} else if (type === 'TRUSTED') {
		count = await prisma.$queryRaw`
			SELECT COUNT(*) as count
			FROM servers
			WHERE flags & ${ServerFlags.trusted}
			AND last_updated >= ${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}
			AND state != 'blocked'`
		count	=	await prisma.$queryRaw`
			SELECT COUNT(*) as count
			FROM servers
			WHERE flags & ${ServerFlags.trusted}
			AND last_updated >= ${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}
			AND state != 'blocked'`
		res.push(	await prisma.$queryRaw`
			SELECT id
			FROM servers
			WHERE flags & ${ServerFlags.trusted}
			AND last_updated >= ${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}
			AND state != 'blocked'
			ORDER BY RAND()
			LIMIT 16 OFFSET ${(page ? Number(page) : 1) - 1}`)
	} else if (type === 'NEW') {
		count = await prisma.servers.count({ where: { state: { not: 'blocked' } } })
		res.push(await prisma.servers.findMany({
			select: { id: true },
			orderBy: { date: 'desc' },
			where: {
				lastUpdated: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
				state: { not: 'blocked' }
			},
			take: 16,
			skip: ((page ? Number(page) : 1) - 1) * 16
		}))
	} else if (type === 'PARTNERED') {
		const servers = await prisma.servers.findMany({
			select: { flags: true },
			where: {
				lastUpdated: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), },
				state: { not: 'blocked' }
			}
		}) 
		count = servers.filter(server => { return server.flags & ServerFlags.trusted}).length
		res.push(await prisma.$queryRaw`
			SELECT id
			FROM servers
			WHERE flags & ${ServerFlags.partnered}
			AND last_updated >= ${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}
			AND state != 'blocked'
			ORDER BY RAND()
			LIMIT 16 OFFSET ${(page ? Number(page) : 1) - 1}`)
	} else if (type === 'CATEGORY') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		if (!serverCategories.includes(query)) throw new Error('알 수 없는 카테고리입니다.')
		count = await prisma.servers.count({
			where: {
				lastUpdated: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
				category: { contains: decodeURIComponent(query) },
				state: { not: 'blocked' }
			}
		})
		res.push(await prisma.servers.findMany({
			select: { id: true },
			where: {
				category: { contains: decodeURIComponent(query) },
				lastUpdated: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
				state: { not: 'blocked' }
			},
			take: 16,
			orderBy: { votes: 'desc' },
			skip: ((page ? Number(page) : 1) - 1) * 16
		}))
	} else if (type === 'SEARCH') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		count = await prisma.$queryRaw`
			SELECT COUNT(*) as count
			FROM servers
			WHERE state != 'blocked'
			AND last_updated >= ${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}
			AND MATCH(name, intro, \`desc\`) AGAINST(${decodeURIComponent(query)} in boolean mode)`
		res.push(await prisma.$queryRaw`
			SELECT id, votes, MATCH(name, intro, \`desc\`) AGAINST(${decodeURIComponent(query)} in boolean mode) as relevance
			FROM servers
			WHERE state != 'blocked'
			AND last_updated >= ${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}
			AND MATCH(name, intro, \`desc\`) AGAINST(${decodeURIComponent(query)} in boolean mode)
			ORDER BY relevance DESC, votes DESC
			LIMIT 16 OFFSET ${(page ? Number(page) : 1) - 1}`)
	}
	return { type, data: (await Promise.all(res.map(async el => await getServer(el.id)))).map(r=> ({...r})), currentPage: page, totalPage: Math.ceil(Number(count) / 16) }
}

async function getBotSubmit(id: string, date: number): Promise<SubmittedBot> {
	const res = await prisma.submitted.findFirst({
		where: {
			id: { equals: id },
			date: { equals: date },
		},
		select: {
			id: true,
			date: true,
			category: true,
			lib: true,
			prefix: true,
			intro: true,
			desc: true,
			url: true,
			web: true,
			git: true,
			discord: true,
			state: true,
			owners: true,
			reason: true,
		},
	})
	if(!res) return null
	const result: SubmittedBot = {
		...res,
		lib: res.lib as Library,
		category: JSON.parse(res.category) as BotCategory[],
		owners: await Promise.all(JSON.parse(res.owners).map(async (u: string)=> await get.user.load(u)))
	}
	return result
}

async function getBotSubmits(id: string): Promise<SubmittedBot[]> {
	if (!id) return []

	const res = await prisma.submitted.findMany({
		where: {
			owners: { contains: id },
		},
		orderBy: { date: 'desc' },
		select: {
			id: true,
			date: true,
			category: true,
			lib: true,
			prefix: true,
			intro: true,
			desc: true,
			url: true,
			web: true,
			git: true,
			discord: true,
			state: true,
			owners: true,
			reason: true,
		},
	})

	const transformedRes = await Promise.all(
		res.map(async (el) => {
			const result = {
				...el,
				lib: el.lib as Library,
				category: JSON.parse(el.category),
				owners: await Promise.all(JSON.parse(el.owners).map(async (u: string) => await get.user.load(u)))
			}

			return result
		})
	)

	return transformedRes
}

/**
 * @param userID
 * @param botID
 * @returns Timestamp
 */
async function getVote(userID: string, targetID: string, type: 'bot' | 'server'): Promise<number|null> {
	const user = await prisma.users.findFirst({
		select: { votes: true },
		where: { id: userID }
	})

	if(!user) return null
	const data = JSON.parse(user.votes)
	return data[`${type}:${targetID}`] || 0
}

async function getWebhook(id: string, type: 'bots' | 'servers'): Promise<Webhook | null> {
	if (type === 'bots') {
		const res = await prisma.bots.findFirst({
			select: {
				webhookUrl: true,
				webhookStatus: true,
				webhookFailedSince: true,
				webhookSecret: true
			},
			where: { id }
		})
		if (!res) return null
		return {
			url: res.webhookUrl,
			status: res.webhookStatus,
			failedSince: res.webhookFailedSince,
			secret: res.webhookSecret
		}
	} else {
		const res = await prisma.servers.findFirst({
			select: {
				webhookUrl: true,
				webhookStatus: true,
				webhookFailedSince: true,
				webhookSecret: true
			},
			where: { id }
		})
		if (!res) return null
		return {
			url: res.webhookUrl,
			status: res.webhookStatus,
			failedSince: res.webhookFailedSince,
			secret: res.webhookSecret
		}
	}
}

async function voteBot(userID: string, botID: string): Promise<number|boolean> {
	const user = await prisma.users.findFirst({
		select: { votes: true },
		where: { id: userID }
	})
	const key = `bot:${botID}`

	if(!user) return null
	const date = + new Date()
	const data = JSON.parse(user.votes)
	const lastDate = data[key] || 0
	if(date - lastDate < VOTE_COOLDOWN) return VOTE_COOLDOWN - (date - lastDate)
	data[key] = date

	await prisma.bots.update({
		where: { id: botID },
		data: { votes: { increment: 1 } },
	})
	await prisma.users.update({
		where: { id: userID },
		data: { votes: JSON.stringify(data) }
	})

	const record = await Bots.updateOne({ _id: botID, 'voteMetrix.day': getYYMMDD() }, { $inc: { 'voteMetrix.$.increasement': 1, 'voteMetrix.$.count': 1 } })
	if(record.matchedCount === 0) await Bots.findByIdAndUpdate(botID, { $push: { voteMetrix: { count: (await prisma.bots.findFirst({where:{ id: botID }})).votes } } }, { upsert: true })
	return true
}

async function voteServer(userID: string, serverID: string): Promise<number|boolean> {
	const user = await prisma.users.findFirst({
		select: { votes: true },
		where: { id: userID }
	})
	const key = `server:${serverID}`

	if(!user) return null
	const date = +new Date()
	const data = JSON.parse(user.votes)
	const lastDate = data[key] || 0
	if(date - lastDate < VOTE_COOLDOWN) return VOTE_COOLDOWN - (date - lastDate)
	data[key] = date

	await prisma.servers.update({
		where: { id: serverID },
		data: { votes: { increment: 1 } },
	})
	await prisma.users.update({
		where: { id: userID },
		data: { votes: JSON.stringify(data) }
	})
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
	const submits = await prisma.submitted.findMany({
		where: {
			state: 0,
			owners: { contains: id }
		},
		select: { id: true }
	})
	if(submits.length > 1) return 1
	const botId = data.id
	const strikes = await get.botSubmitStrikes(botId)
	if(strikes >= 3) return 5
	const date =  Math.round(+new Date()/1000)
	const sameID = await prisma.submitted.findMany({
		select: { id: true },
		where: { id: botId, state:0 }
	})
	const bot = await get.bot.load(data.id)
	if(sameID.length !== 0 || bot) return 2
	const user = await DiscordBot.users.fetch(data.id)
	if(!user) return 3
	const member = await getMainGuild().members.fetch(id).then(() => true).catch(() => false)
	if(!member) return 4
	await prisma.submitted.create({
		data: {
			id: botId,
			date,
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
			state: 0,
		},
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
	if(!inviteData || inviteData.guild.id !== id || inviteData.expiresAt) return 4
	await prisma.servers.create({
		data:{
			id: id,
			name: serverData.name,
			owners: JSON.stringify([ serverData.owner, ...serverData.admins ]),
			intro: data.intro,
			desc: data.desc,
			category: JSON.stringify(data.category),
			invite: data.invite,
			token: sign({ id })
		}
	})

	get.server.clear(id)
	return true
}

async function getBotSpec(id: string, userID: string): Promise<BotSpec | null> {
	const res = await prisma.bots.findFirst({
		select: {
			id: true,
			token: true,
			webhookUrl: true,
			webhookStatus: true
		},
		where: { id, owners: { contains: userID } }
	})

	if(!res) return null
	return {
		id: res.id,
		token: res.token,
		webhookURL: res.webhookUrl,
		webhookStatus: res.webhookStatus
	}
}

async function getServerSpec(id: string, userID: string): Promise<ServerSpec | null> {
	const res = await prisma.servers.findFirst({
		select: {
			id: true,
			token: true,
			webhookUrl: true,
			webhookStatus: true
		},
		where: { id, owners: { contains: userID } }
	})

	if(!res) return null
	return {
		id: res.id,
		token: res.token,
		webhookURL: res.webhookUrl,
		webhookStatus: res.webhookStatus
	}
}

async function deleteBot(id: string): Promise<boolean> {
	const bot = await prisma.bots.delete({ where: { id } })
	get.bot.clear(id)
	return !!bot
}

async function deleteServer(id: string): Promise<boolean> {
	const server = await prisma.servers.delete({ where: { id } })
	return !!server
}

async function updateBot(id: string, data: ManageBot): Promise<number> {
	const res = await prisma.bots.findUnique({ where: { id } })
	if(!res) return 0
	await prisma.bots.update({
		data: {
			prefix: data.prefix,
			lib: data.library,
			web: data.website,
			git: data.git,
			url: data.url,
			discord: data.discord,
			category: JSON.stringify(data.category),
			intro: data.intro,
			desc: data.desc,
		},
		where: { id }
	})

	return 1
}

async function updatedServer(id: string, data: ManageServer) {
	const res = await prisma.servers.findUnique({ where: { id } })
	if(!res) return 0
	await prisma.servers.update({
		data: {
			invite: data.invite,
			category: JSON.stringify(data.category),
			intro: data.intro,
			desc: data.desc
		},
		where:{ id }
	})

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

	await prisma.bots.update({
		data: {
			servers: servers === undefined ? bot.servers : servers,
			shards: shards === undefined ? bot.shards : shards,
		},
		where: { id }
	})

	if(servers) {
		await Bots.findByIdAndUpdate(id, { $pull: { serverMetrix: { day: getYYMMDD() } } }, { upsert: true })
		await Bots.findByIdAndUpdate(id, { $push: { serverMetrix: { count: servers } } })
	}
	return
}

async function updateWebhook(id: string, type: 'bots' | 'servers', value: Partial<Webhook>) {
	if (type === 'bots') {
		const res = await prisma.bots.update({
			data: {
				webhookUrl: value.url,
				webhookStatus: value.status,
				webhookFailedSince: value.failedSince,
				webhookSecret: value.secret
			},
			where: { id }
		})

		if(!res) return false
		return true
	} else {
		const res = await prisma.servers.update({
			data: {
				webhookUrl: value.url,
				webhookStatus: value.status,
				webhookFailedSince: value.failedSince,
				webhookSecret: value.secret
			},
			where: { id }
		})

		if(!res) return false
		return true
	}
}

async function updateOwner(id: string, owners: string[]): Promise<void> {
	await prisma.bots.update({
		data: { owners: JSON.stringify(owners) },
		where: { id }
	})
	get.bot.clear(id)
}

async function resetBotToken(id: string, beforeToken: string) {
	const token = sign({ id })
	const bot = await prisma.bots.updateMany({
		data: { token },
		where: { id: id, token: beforeToken }
	})
	if(bot.count !== 1) return null
	return token
}

async function resetServerToken(id: string, beforeToken: string) {
	const token = sign({ id })
	const server = await prisma.servers.updateMany({
		data: { token },
		where: { id: id, token: beforeToken }
	})
	if(server.count !== 1) return null
	return token
}

async function Github(id: string, github: string) {
	const user = await prisma.users.findFirst({
		where:{
			github,
			NOT: { id }
		}	
	})
	if(github && !user) return 0
	await prisma.users.update({
		data: { github },
		where: { id }
	})
	return 1
}

async function getImage(url: string) {
	const res = await fetch(url)
	if(!res.ok) return null
	return await res.buffer()
}

async function getDiscordUser(id: string, raw = false):Promise<APIDiscordUser & { global_name: string } | DiscordUser> {
	if(raw) {
		return await DiscordBot.rest.get(`/users/${id}`).catch(() => null) as APIDiscordUser & { global_name: string }
	}
	return await DiscordBot.users.fetch(id, {cache: true}).then(u => u).catch(()=>null)
}

/**
 *
 * @param info
 * @returns 1 - UnVerified
 * @returns 2 - Blocked
 */
async function assignToken(info: TokenRegister):Promise<string|1|2> {
	let token = await prisma.users.findFirst({
		select: { token: true, perm: true },
		where: { id: info.id || '' }
	})
	let t: string
	if(!info.verified) return 1
	if(!token) {
		t = sign({ id: info.id }, { expiresIn: '30d' })
		await prisma.users.create({
			data: {
				token: t,
				date: Math.round(Number(new Date()) / 1000),
				id: info.id,
				email: info.email,
				tag: info.discriminator,
				username: info.username,
				discord: sign({ access_token: info.access_token, expires_in: info.expires_in, refresh_token: info.refresh_token })
			}
		})
		token = await prisma.users.findUnique({
			select: { token: true, perm: true },
			where: { id: info.id }
		})
	} else {
		await prisma.users.update({
			data: {
				email: info.email,
				tag: info.discriminator,
				username: info.username,
				discord: sign({
					access_token: info.access_token,
					expires_in: info.expires_in,
					refresh_token: info.refresh_token,
				})
			},
			where: {
				id: info.id,
			}
		})
	}
	if(token.perm && token.perm !== 'user') return 2
	if(!verify(token.token ?? '')) {
		t = sign({ id: info.id }, { expiresIn: '30d' })
		await prisma.users.update({
			data: { token: t },
			where: { id: info.id }
		})
	} else t = token.token

	return t
}

async function Authorization(token: string):Promise<string|false> {
	const tokenInfo = verify(token ?? '')
	const user = await prisma.users.findFirst({
		select: { id: true },
		where: { id: tokenInfo.id ?? '', token: token ?? ''  }
	})
	if(!user) return false
	else return user.id
}

async function BotAuthorization(token: string):Promise<string|false> {
	const tokenInfo = verify(token ?? '')
	const bot = await prisma.bots.findFirst({
		select: { id: true },
		where: { id: tokenInfo.id ?? '', token: token ?? '' }
	})
	
	if(!bot) return false
	else return bot.id
}

async function ServerAuthorization(token: string): Promise<string|false> {
	const tokenInfo = verify(token ?? '')
	const server = await prisma.servers.findFirst({
		select: { id: true },
		where: { id: tokenInfo?.id ?? '', token: token ?? '' }
	})
	
	if(!server) return false
	else return server.id
}

async function fetchUserDiscordToken(id: string): Promise<DiscordTokenInfo> {
	const res = await prisma.users.findUnique({
		select: { discord: true },
		where: { id }
	})
	let discord = verify(res.discord ?? '')
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
		await prisma.users.update({
			data: {
				discord: sign({
					access_token: token.access_token,
					expires_in: token.expires_in,
					refresh_token: token.refresh_token,
				})
			},
			where: { id },
		})
		
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
	const res = await prisma.submitted.findMany({
		select: { id: true, date: true },
		where: { state: 0 }
	})
	return await Promise.all(res.map(b => get.botSubmit.load(JSON.stringify({ id: b.id, date: b.date }))))
}

async function getBotSubmitHistory(id: string): Promise<SubmittedBot[]> {
	const res = await prisma.submitted.findMany({
		select: { id: true, date: true },
		where: { id }
	})
	return await Promise.all(res.map(b => get.botSubmit.load(JSON.stringify({ id: b.id, date: b.date }))))
}

async function denyBotSubmission(id: string, date: number, reason?: string) {
	await prisma.submitted.updateMany({
		data: { state: 2, reason: reason || null },
		where: { state: 0, id, date }
	})
}

async function getBotSubmitStrikes(id: string) {
	const identicalSubmits = await prisma.submitted.findMany({
		select: { id: true },
		where: {
			id, 
			state: 2,
			reason: {
				notIn: ['PRIVATE', 'OFFLINE', 'ABSENT_AT_DISCORD'] // 다음 사유를 제외한 다른 사유의 3회 이상 거부 존재시 봇 등록 제한.
			}
		}
	})

	return identicalSubmits.length
}

async function approveBotSubmission(id: string, date: number) {
	const data = await prisma.submitted.findFirst({
		select: {
			id: true,
			date: true,
			category: true,
			lib: true,
			prefix: true,
			intro: true,
			desc: true,
			url: true,
			web: true,
			git: true,
			discord: true,
			state: true,
			owners: true,
			reason: true
		},
		where: { state: 0, id, date }
	})
	
	if(!data) return false
	await prisma.submitted.updateMany({
		data: { state: 1 },
		where: { state: 0, id, date}
	})
	await prisma.bots.create({
		data: {
			id,
			date,
			owners: data.owners,
			lib: data.lib,
			prefix: data.prefix,
			intro: data.intro,
			desc: data.desc,
			url: data.url,
			web: data.web,
			git: data.git,
			category: data.category,
			discord: data.discord,
			token: sign({ id }),
		}
	})
	
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
	if(record.matchedCount === 0) await Bots.findByIdAndUpdate(id, { $push: { viewMetrix: { count: 0 } } }, { upsert: true })
}

export const get = {
	discord: {
		user: new DataLoader(
			async (ids: string[]) =>
				(await Promise.all(ids.map(async (id: string) => await getDiscordUser(id, false) as DiscordUser)))
			, { cacheMap: new TLRU({ maxStoreSize: 5000, maxAgeMs: 43200000 }) }),
		_rawUser: new DataLoader(
			async (ids: string[]) =>
				(await Promise.all(ids.map(async (id: string) => await getDiscordUser(id, true) as APIDiscordUser & { global_name: string })))
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
	webhook: getWebhook,
	botVote: async (botID: string, targetID: string) => await getVote(botID, targetID, 'bot'),
	vote: getVote,
	Authorization,
	BotAuthorization,
	ServerAuthorization,
	botSubmitList: getBotSubmitList,
	botSubmitHistory: getBotSubmitHistory,
	botSubmitStrikes: getBotSubmitStrikes,
	serverOwners: fetchServerOwners
}

export const update = {
	assignToken,
	resetBotToken,
	resetServerToken,
	updateServer,
	Github,
	bot: updateBot,
	server: updatedServer,
	botOwners: updateOwner,
	webhook: updateWebhook,
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
