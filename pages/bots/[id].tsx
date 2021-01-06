import { NextPage, NextPageContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Container from '../../components/Container'
import DiscordImage from '../../components/DiscordImage'
import { Bot } from '../../types'
import Fetch from '../../utils/Fetch'
import NotFound from '../404'

const Bots:NextPage<BotsProps> = ({ data }) => {
	console.log(data)
	if(!data.id) return <NotFound />
	return <Container paddingTop className='py-10 lg:flex'>
		<div className='w-full lg:w-1/3 flex-col'>
			<DiscordImage userID={data.id} avatarHash={data.avatar} tag={data.tag} className='w-full'/>
		</div>
		<div className='py-10 px-4 flex-col w-full text-center lg:text-left'>
			<h1 className='text-4xl font-bold mb-5'>{data.name}</h1>
			<p className='text-base'>{data.desc}</p>
		</div>
	</Container>
}

export const getServerSideProps = async (ctx: Context) => {
	const data = await Fetch.bot.load(ctx.query.id)
	return { props: { data } }
}

export default Bots

interface BotsProps {
  data: Bot
}
interface Context extends NextPageContext {
  query: Query
}

interface Query extends ParsedUrlQuery {
  id: string
}