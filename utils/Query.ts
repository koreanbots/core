import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import knsexy from 'knex'

export const knex = knsexy({
	client: 'mysql',
	connection: {
		host: process.env.MYSQL_HOST || 'localhost',
		user: process.env.MYSQL_USER || 'root',
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE || 'discordbots',
	},
})

export async function getBot(id: string) {}

export async function getUser(id: string) {
	const res = await knex('users')
		.select(['id', 'avatar', 'tag', 'username', 'perm', 'github'])
		.where({ id })
}
