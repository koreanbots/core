import { NextPage, GetServerSideProps } from 'next'
import NotFound from 'pages/404'
import { get } from '@utils/Query'
import { Bots } from '@utils/Mongo'
import { getYYMMDD } from '@utils/Tools'
const Invite: NextPage = () => <NotFound />

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const data = await get.bot.load(ctx.query.id as string)
	if (!data) return { props: {} }
	const record = await Bots.updateOne(
		{ _id: data.id, 'inviteMetrix.day': getYYMMDD() },
		{ $inc: { 'inviteMetrix.$.count': 1 } }
	)
	if (record.matchedCount === 0)
		await Bots.findByIdAndUpdate(
			data.id,
			{ $push: { inviteMetrix: { count: 1 } } },
			{ upsert: true }
		)
	ctx.res.statusCode = 307
	ctx.res.setHeader(
		'Location',
		data.url ||
			`https://discordapp.com/oauth2/authorize?client_id=${data.id}&scope=bot&permissions=0`
	)
	return {
		props: {},
	}
}

export default Invite
