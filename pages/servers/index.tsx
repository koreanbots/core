import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import { Server, List } from '@types'
import * as Query from '@utils/Query'

const Advertisement = dynamic(() => import('@components/Advertisement'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const Container = dynamic(() => import('@components/Container'))
const ServerCard = dynamic(() => import('@components/ServerCard'))
const Paginator = dynamic(() => import('@components/Paginator'))
const Hero = dynamic(() => import('@components/Hero'))

const ServerIndex: NextPage<ServerIndexProps> = ({ votes, trusted }) => {
	return <>
		<Hero type='servers' />
		<Container className='pb-10'>
			<Advertisement />
			<h1 className='text-3xl font-bold mt-10 mb-2'>
				<i className='far fa-heart mr-3 text-pink-600' /> 하트 랭킹
			</h1>
			<p className='text-base'>하트를 많이 받은 서버들의 순위입니다!</p>
			<ResponsiveGrid>
				{
					votes.data.map(server=> <ServerCard type='list' key={server.id} server={server} />)
				}
			</ResponsiveGrid>
			<Paginator totalPage={votes.totalPage} currentPage={votes.currentPage} pathname='/list/votes' />
			<Advertisement />
			<h1 className='text-3xl font-bold mb-2'>
				<i className='fa fa-check mr-3 mt-10 text-green-500' /> 신뢰된 봇
			</h1>
			<p className='text-base'>KOREANBOTS에서 인증받은 신뢰할 수 있는 봇들입니다!!</p>
			<ResponsiveGrid>
				{
					trusted.data.slice(0, 4).map(server=> <ServerCard type='list' key={server.id} server={server} />)
				}
			</ResponsiveGrid>
			<Advertisement />
		</Container>
	</>
}

export const getServerSideProps = async() => {
	const votes = await Query.get.serverList.votes.load(1)
	const trusted = await Query.get.serverList.trusted.load(1)

	return { props: { votes,trusted }}

}

interface ServerIndexProps {
	votes: List<Server>
	newBots: List<Server>
	trusted: List<Server>
}

export default ServerIndex
