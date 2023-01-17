import mongoose from 'mongoose'
import { getYYMMDD } from './Tools'

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST || 'localhost'}/${process.env.MONGO_DATABASE}`)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => 
	console.log('[DB] Mongo Connected')
)

const metrix = { day: { type: String, default: getYYMMDD, unique: true }, createdAt: { type: Date, default: Date.now }, count: Number }
const botSchema = new mongoose.Schema({
	_id: String,
	serverMetrix: [ metrix ],
	viewMetrix: [ metrix ],
	voteMetrix: [ { ...metrix, increasement: { type: Number, default: 1 } } ],
	inviteMetrix: [ metrix ],
	comments: [ { author: String, date: { type: Date, defualt: Date.now }, comment: String, rating: Number, upvotes: [ String ], downvotes: [ String ] } ],
})

const serverSchema = new mongoose.Schema({
	_id: String,
	data: {}
})

export const Bots = mongoose.model('bots', botSchema)
export const Servers = mongoose.model('servers', serverSchema)