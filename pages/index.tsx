import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import { Bot, List, Server } from '@types'
import * as Query from '@utils/Query'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

const Advertisement = dynamic(() => import('@components/Advertisement'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const Container = dynamic(() => import('@components/Container'))
const BotCard = dynamic(() => import('@components/BotCard'))
const ServerCard = dynamic(() => import('@components/ServerCard'))
const Hero = dynamic(() => import('@components/Hero'))
const LongButton = dynamic(() => import('@components/LongButton'))

const Index: NextPage<IndexProps> = ({ bots, servers }) => {
	return (
		<>
			<Hero />
			<Container className='pb-10'>
				<Advertisement />
				<h1 className='mb-2 mt-10 text-3xl font-bold'>
					<i className='fas fa-robot mr-5 text-koreanbots-blue' /> 봇 리스트
				</h1>
				<p className='text-base'>하트를 많이 받은 봇들의 순위입니다!</p>
				<ResponsiveGrid>
					{bots.data.slice(0, 8).map((bot) => (
						<BotCard key={bot.id} bot={bot} />
					))}
				</ResponsiveGrid>
				<LongButton href='/bots' center>
					봇 리스트 바로가기
				</LongButton>
				<Advertisement />
				<h1 className='mb-2 mt-10 text-3xl font-bold'>
					<i className='fas fa-users mr-5 text-koreanbots-blue' /> 서버 리스트
				</h1>
				<p className='text-base'>하트를 많이 받은 서버들의 순위입니다!</p>
				<ResponsiveGrid>
					{servers.data.slice(0, 8).map((bot) => (
						<ServerCard key={bot.id} type='list' server={bot} />
					))}
				</ResponsiveGrid>
				<LongButton href='/servers' center>
					서버 리스트 바로가기
				</LongButton>
				<Advertisement />
			</Container>
		</>
	)
}

export const getStaticProps = async () => {
	if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
		const list = {
			totalPage: 1,
			currentPage: 1,
			data: [],
		}
		return {
			props: {
				bots: list,
				servers: list,
			},
			revalidate: 1,
		}
	}
	const bots = await Query.get.list.votes.load(1)
	const servers = await Query.get.serverList.votes.load(1)

	return { props: { bots, servers }, revalidate: 60 }
}

interface IndexProps {
	bots: List<Bot>
	servers: List<Server>
}

export default Index
