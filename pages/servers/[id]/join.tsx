import { NextPage, GetServerSideProps } from 'next'
import NotFound from 'pages/404'
import { get } from '@utils/Query'
import { Servers } from '@utils/Mongo'
import { getYYMMDD } from '@utils/Tools'
import { DiscordEnpoints } from '@utils/Constants'
const Join: NextPage = () => <NotFound />

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const data = await get.server.load(ctx.query.id as string)
	if(!data) return { props: {} }
	const record = await Servers.updateOne({ _id: data.id, 'joinMetrix.day': getYYMMDD() }, { $inc: { 'joinMetrix.$.count': 1 } })
	if(record.matchedCount === 0) await Servers.findByIdAndUpdate(data.id, { $push: { joinMetrix: { count: 1 } } }, { upsert: true })
	ctx.res.statusCode = 307
	ctx.res.setHeader('Location', DiscordEnpoints.ServerInvite(data.invite))
	return {
		props: {}
	}
}

export default Join