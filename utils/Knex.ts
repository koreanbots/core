import knex from 'knex'

export default knex({
	client: 'mysql',
	connection: {
		port: Number(process.env.MYSQL_PORT) || 3306,
		host: process.env.MYSQL_HOST || 'localhost',
		user: process.env.MYSQL_USER || 'root',
		password: process.env.MYSQL_PASSWORD || 'test',
		database: process.env.MYSQL_DATABASE || 'discordbots',
		charset: 'utf8mb4',
	},
})
