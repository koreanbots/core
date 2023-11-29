import mongoose, { InferSchemaType, Model, ObtainSchemaGeneric, Schema } from 'mongoose'
import { getYYMMDD } from './Tools'

mongoose.connect(
	`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${
		process.env.MONGO_HOST || 'localhost'
	}/${process.env.MONGO_DATABASE}`
)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('[DB] Mongo Connected'))

const metrix = {
	day: { type: String, default: getYYMMDD, unique: true },
	createdAt: { type: Date, default: Date.now },
	count: Number,
}
const botSchema = new mongoose.Schema({
	_id: String,
	serverMetrix: [metrix],
	viewMetrix: [metrix],
	voteMetrix: [{ ...metrix, increasement: { type: Number, default: 1 } }],
	inviteMetrix: [metrix],
	comments: [
		{
			author: String,
			date: { type: Date, defualt: Date.now },
			comment: String,
			rating: Number,
			upvotes: [String],
			downvotes: [String],
		},
	],
})

const serverSchema = new mongoose.Schema({
	_id: String,
	data: {},
})

type ModelType<TSchema extends Schema> = Model<
	InferSchemaType<TSchema>,
	ObtainSchemaGeneric<TSchema, 'TQueryHelpers'>,
	ObtainSchemaGeneric<TSchema, 'TInstanceMethods'>,
	ObtainSchemaGeneric<TSchema, 'TVirtuals'>,
	TSchema
> &
	ObtainSchemaGeneric<TSchema, 'TStaticMethods'>

export const Bots =
	(mongoose.models.bots as ModelType<typeof botSchema>) || mongoose.model('bots', botSchema)
export const Servers =
	(mongoose.models.servers as ModelType<typeof serverSchema>) ||
	mongoose.model('servers', serverSchema)
