import knex from 'knex'

export default knex({
	client: 'mysql',
	connection: {
		host: process.env.MYSQL_HOST || 'localhost',
		user: process.env.MYSQL_USER || 'root',
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE || 'discordbots',
		charset: 'utf8mb4',
	},
	debug: process.env.NODE_ENV === 'development',
})
