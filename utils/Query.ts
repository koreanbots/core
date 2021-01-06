import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import knsexy from 'knex'
import { Bot, User } from '../types'

const publicPem = fs.readFileSync('./public.pem')
const privateKey = fs.readFileSync('./private.key')

export const knex = knsexy({
	client: 'mysql',
	connection: {
		host: process.env.MYSQL_HOST || 'localhost',
		user: process.env.MYSQL_USER || 'root',
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE || 'discordbots',
	},
})

export async function getBot(id: string, owners=true):Promise<Bot> {
	const res = await knex('bots').select(['id', 'owners', 'lib', 'prefix', 'votes', 'servers', 'intro', 'desc', 'web', 'git', 'url', 'category', 'status', 'name', 'avatar', 'tag', 'verified', 'trusted', 'partnered', 'discord', 'boosted', 'state', 'vanity', 'bg', 'banner']).where({ id }).orWhere({ vanity: id, boosted: 1 })
	if(res[0]) {
		res[0].category = JSON.parse(res[0].category)
		res[0].owners = JSON.parse(res[0].owners)
		if(owners) res[0].owners = res[0].owners.map(async (u: string) => await getUser(u))
		res[0].owners = await Promise.all(res[0].owners.filter((el: User|null)=> el))
		res[0].vanity = res[0].vanity && ( res[0].boosted || res[0].trusted || res[0].partnered )
    
	}
  
	return res[0] || null
}

export async function getUser(id: string, bots=true):Promise<User> {
	const res = await knex('users').select(['id', 'avatar', 'tag', 'username', 'perm', 'github']).where({ id })
	if(res[0]) {
		const owned = await knex('bots').select(['id']).where('owners', 'like', `%${id}%`)
		if(bots) res[0].bots = owned.map(async b=> await getBot(b.id, false))
		else res[0].bots = owned.map(async b=> b.id)
		res[0].bots = await Promise.all(res[0].bots.filter((el:Bot|null)=> el))
	}
  
	return res[0] || null
  
}
