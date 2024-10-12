import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import { Bot, List } from '@types'
import * as Query from '@utils/Query'
import LongButton from '@components/LongButton'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

const Advertisement = dynamic(() => import('@components/Advertisement'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const Container = dynamic(() => import('@components/Container'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Paginator = dynamic(() => import('@components/Paginator'))
const Hero = dynamic(() => import('@components/Hero'))

const Index: NextPage<IndexProps> = ({ votes, newBots, trusted }) => {
	return (
		<>
			<Hero type='bots' />
			<Container className='pb-10'>
				<Advertisement />
				<h1 className='mb-2 mt-10 text-3xl font-bold'>
					<i className='far fa-heart mr-3 text-pink-600' /> 하트 랭킹
				</h1>
				<p className='text-base'>하트를 많이 받은 봇들의 순위입니다!</p>
				<ResponsiveGrid>
					{votes.data.map((bot) => (
						<BotCard key={bot.id} bot={bot} />
					))}
				</ResponsiveGrid>
				<Paginator
					totalPage={votes.totalPage}
					currentPage={votes.currentPage}
					pathname='/bots/list/votes'
				/>
				<Advertisement />
				<h1 className='mb-2 text-3xl font-bold'>
					<i className='fa fa-check mr-3 mt-10 text-emerald-500' /> 신뢰된 봇
				</h1>
				<p className='text-base'>한국 디스코드 리스트에서 인증받은 신뢰할 수 있는 봇들입니다!!</p>
				<ResponsiveGrid>
					{trusted.data.slice(0, 4).map((bot) => (
						<BotCard key={bot.id} bot={bot} />
					))}
				</ResponsiveGrid>
				{trusted.data.length > 4 && (
					<LongButton href='/bots/list/trusted' center>
						더보기
					</LongButton>
				)}
				<h1 className='mb-2 mt-20 text-3xl font-bold'>
					<i className='far fa-star mr-3 text-amber-500' /> 새로운 봇
				</h1>
				<p className='text-base'>최근에 한국 디스코드 리스트에 추가된 따끈따끈한 봇입니다.</p>
				<ResponsiveGrid>
					{newBots.data.slice(0, 4).map((bot) => (
						<BotCard key={bot.id} bot={bot} />
					))}
				</ResponsiveGrid>
				<LongButton href='/bots/list/new' center>
					더보기
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
				votes: list,
				newBots: list,
				trusted: list,
			},
			revalidate: 1,
		}
	}
	const votes = await Query.get.list.votes.load(1)
	const newBots = await Query.get.list.new.load(1)
	const trusted = await Query.get.list.trusted.load(1)

	return { props: { votes, newBots, trusted }, revalidate: 60 }
}

interface IndexProps {
	votes: List<Bot>
	newBots: List<Bot>
	trusted: List<Bot>
}

export default Index
