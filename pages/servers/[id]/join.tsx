import { NextPage, GetServerSideProps } from 'next'
import NotFound from 'pages/404'
import { get } from '@utils/Query'
import { DiscordEnpoints } from '@utils/Constants'
const Join: NextPage = () => <NotFound />

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const data = await get.server.load(ctx.query.id as string)
	if(!data) return { props: {} }
	// // const record = await Bots.updateOne({ _id: data.id, 'inviteMetrix.day': getYYMMDD() }, { $inc: { 'inviteMetrix.$.count': 1 } })
	// if(record.n === 0) await Bots.findByIdAndUpdate(data.id, { $push: { inviteMetrix: { count: 1 } } }, { upsert: true })
	ctx.res.statusCode = 307
	ctx.res.setHeader('Location', DiscordEnpoints.ServerInvite(data.invite))
	return {
		props: {}
	}
}

export default Join