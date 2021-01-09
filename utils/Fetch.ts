import DataLoader from 'dataloader'
import fs from 'fs'
import { Bot, ListType, User, BotList } from '../types'
import knex from './Knex'
import { cats } from './Constants'
import { botListArgument } from './Yup'
import { ReactText } from 'react'

const publicPem = fs.readFileSync('./public.pem')
const privateKey = fs.readFileSync('./private.key')

const bot = new DataLoader(
	async (ids: string[]) =>
		(await Promise.all(ids.map(async (el: string) => getBot(el)))).map(row => ({ ...row }))
)

new DataLoader(async ()=> { return []})
const botWithNoUser = new DataLoader(
	async (ids: string[]) =>
		(await Promise.all(ids.map(async (el: string) => getBot(el, false)))).map(row => ({ ...row }))
)

const user = new DataLoader(
	async (ids: string[]) =>
		(await Promise.all(ids.map((el: string) => getUser(el)))).map(row => ({ ...row }))
)

const userWithNoBot = new DataLoader(
	async (ids: string[]) =>
		(await Promise.all(ids.map((el: string) => getUser(el, false)))).map(row => ({ ...row }))
)

const botListVotes = new DataLoader(
	async (page: number[]) =>
		(await Promise.all(page.map((el) => getBotList('VOTE', el)))).map(row => ({ ...row })),
	{
		batchScheduleFn: callback => setTimeout(callback, 100),
	}
)

const botListNew = new DataLoader(
	async (page: number[]) =>
		(await Promise.all(page.map((el) => getBotList('NEW', el)))).map(row => ({ ...row })),
	{
		batchScheduleFn: callback => setTimeout(callback, 100),
	}
)

const botListTrusted = new DataLoader(
	async (page: number[]) =>
		(await Promise.all(page.map((el) => getBotList('TRUSTED', el)))).map(row => ({ ...row })),
	{
		batchScheduleFn: callback => setTimeout(callback, 100),
	}
)

async function getBot(id: string, owners = true): Promise<Bot> {
	const res = await knex('bots')
		.select([
			'id',
			'owners',
			'lib',
			'prefix',
			'votes',
			'servers',
			'intro',
			'desc',
			'web',
			'git',
			'url',
			'category',
			'status',
			'name',
			'avatar',
			'tag',
			'verified',
			'trusted',
			'partnered',
			'discord',
			'boosted',
			'state',
			'vanity',
			'bg',
			'banner',
		])
		.where({ id })
		.orWhere({ vanity: id, trusted: true })
		.orWhere({ vanity: id, partnered: true })
	if (res[0]) {
		res[0].category = JSON.parse(res[0].category)
		res[0].owners = JSON.parse(res[0].owners)
		if (owners)
			res[0].owners = await Promise.all(
				res[0].owners.map(async (u: string) => await userWithNoBot.load(u))
			)
		res[0].owners = res[0].owners.filter((el: User | null) => el).map((row: User) => ({ ...row }))
		res[0].vanity = ((res[0].trusted || res[0].partnered) && res[0].vanity) ?? null
	}

	return res[0] || null
}

async function getUser(id: string, bots = true): Promise<User> {
	const res = await knex('users')
		.select(['id', 'avatar', 'tag', 'username', 'perm', 'github'])
		.where({ id })
	if (res[0]) {
		const owned = await knex('bots')
			.select(['id'])
			.where('owners', 'like', `%${id}%`)
		if (bots) res[0].bots = await Promise.all(owned.map(async b => await botWithNoUser.load(b.id)))
		else res[0].bots = owned.map(async b => b.id)
		res[0].bots = res[0].bots.filter((el: Bot | null) => el).map((row: User) => ({ ...row }))
	}

	return res[0] || null
}

async function getBotList(type: ListType, page = 1, query?: string):Promise<BotList> {
	let res: { id: string }[]
	let count: ReactText
	if (type === 'VOTE') {
		count = (await knex('bots').count())[0]['count(*)']
		res = await knex('bots')
			.orderBy('votes', 'desc')
			.orderBy('servers', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'TRUSTED') {
		count = (
			await knex('bots')
				.where({ trusted: true })
				.count()
		)[0]['count(*)']
		res = await knex('bots')
			.where({ trusted: true })
			.orderByRaw('RAND()')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'NEW') {
		count = (
			await knex('bots')
				.count()
		)[0]['count(*)']
		res = await knex('bots')
			.orderBy('date', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'PARTNERED') {
		count = (
			await knex('bots')
				.where({ partnered: true })
				.count()
		)[0]['count(*)']
		res = await knex('bots')
			.where({ partnered: true })
			.orderByRaw('RAND()')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'CATEGORY') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		if (!cats.includes(query)) throw new Error('알 수 없는 카테고리입니다.')
		count = (
			await knex('bots')
				.where('category', 'like', `%${decodeURI(query)}%`)
				.count()
		)[0]['count(*)']
		res = await knex('bots')
			.where('category', 'like', `%${decodeURI(query)}%`)
			.orderBy('votes', 'desc')
			.orderBy('servers', 'desc')
			.limit(16)
			.offset(((page ? Number(page) : 1) - 1) * 16)
			.select(['id'])
	} else if (type === 'SEARCH') {
		if (!query) throw new Error('쿼리가 누락되었습니다.')
		try {
			new RegExp(query)
			count = (
				await knex('bots')
					.where('name', 'REGEXP', query)
					.orWhere('intro', 'REGEXP', query)
					.orWhere('desc', 'REGEXP', query)
					.orderBy('votes', 'desc')
					.orderBy('servers', 'desc')
					.count()
			)[0]['count(*)']

			res = await knex('bots')
				.where('name', 'REGEXP', query)
				.orWhere('intro', 'REGEXP', query)
				.orWhere('desc', 'REGEXP', query)
				.orderBy('votes', 'desc')
				.orderBy('servers', 'desc')
				.limit(16)
				.offset(((page ? Number(page) : 1) - 1) * 16)
				.select(['id'])
		} catch (e) {
			count = (
				await knex('bots')
					.where('name', 'LIKE', `%${query}%`)
					.orWhere('intro', 'LIKE', `%${query}%`)
					.orWhere('desc', 'LIKE', `%${query}%`)
					.orderBy('votes', 'desc')
					.orderBy('servers', 'desc')
					.count()
			)[0]['count(*)']

			res = await knex('bots')
				.where('name', 'LIKE', `%${query}%`)
				.orWhere('intro', 'LIKE', `%${query}%`)
				.orWhere('desc', 'LIKE', `%${query}%`)
				.orderBy('votes', 'desc')
				.orderBy('servers', 'desc')
				.limit(16)
				.offset(((page ? Number(page) : 1) - 1) * 16)
				.select(['id'])
		}
	} else {
		count = 1
		res = []
	}

	return { type, data: (await Promise.all(res.map(async el => await getBot(el.id)))).map(r=> ({...r})), currentPage: page, totalPage: Math.ceil(Number(count) / 16) }
}

export default { bot, user, botListVotes, botListNew, botListTrusted }
