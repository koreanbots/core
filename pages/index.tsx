import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Paginator from '@components/Paginator'
import Search from '@components/Search'
import Tag from '@components/Tag'

import { BotList } from '@types'
import * as Query from '@utils/Query'
import { cats } from '@utils/Constants'

const Advertisement = dynamic(()=> import('@components/Advertisement'))
const Container = dynamic(()=> import('@components/Container'))
const BotCard = dynamic(()=> import('@components/BotCard'))
const Wave  = dynamic(()=> import('@components/Wave'))

const Index: NextPage<IndexProps> = ({ votes, newBots, trusted }) => {
	return (
		<>
			<div className='dark:bg-discord-black bg-discord-blurple'>
				<Container className='pb-24 pt-20' ignoreColor paddingTop>
					<h1 className='text-center text-gray-100 text-3xl font-bold sm:text-left'>
						한국 디스코드봇 리스트
					</h1>
					<Search />
					<h2 className='text-xl font-bold mt-10 mb-1 text-black dark:text-gray-100'>카테고리로 찾아보기</h2>
					<div className='flex flex-wrap '>
						{ cats.map(t=> <Tag key={t} text={t} dark href={`/categories/${t}`}/>) }
					</div>
				</Container>
			</div>
			<Wave
				color='currentColor'
				className='dark:text-discord-black text-discord-blurple dark:bg-discord-dark bg-white hidden md:block'
			/>

			<Container>
				<Advertisement />
				<h1 className='text-3xl font-bold'>
					<i className='far fa-heart mr-3 text-pink-600' /> 하트 랭킹
				</h1>
				<p className='text-base'>하트를 많이 받은 봇들의 순위입니다!</p>
				<div className='grid gap-4 2xl:grid-cols-4 md:grid-cols-2 mt-10'>
					{
						votes.data.slice(0, 8).map(bot=> <BotCard key={bot.id} bot={bot} />)
					}
				</div>
				<Paginator totalPage={votes.totalPage} currentPage={votes.currentPage}/>
				<h1 className='text-3xl font-bold mt-20'>
					<i className='far fa-star mr-3 text-yellow-500' /> 새로운 봇
				</h1>
				<p className='text-base'>최근에 한국 디스코드봇 리스트에 추가된 따끈따끈한 봇입니다.</p>
				<div className='grid gap-4 2xl:grid-cols-4 md:grid-cols-2 mt-10'>
					{
						newBots.data.slice(0, 4).map(bot=> <BotCard key={bot.id} bot={bot} />)
					}
				</div>
				<h1 className='text-3xl font-bold'>
					<i className='fa fa-check mr-3 mt-10 text-green-500' /> 신뢰된 봇
				</h1>
				<p className='text-base'>KOREANBOTS에서 인증받은 신뢰할 수 있는 봇들입니다!!</p>
				<div className='grid gap-4 2xl:grid-cols-4 md:grid-cols-2 mt-10'>
					{
						trusted.data.slice(0, 4).map(bot=> <BotCard key={bot.id} bot={bot} />)
					}
				</div>
				<Advertisement />
			</Container>
		</>
	)
}

export const getServerSideProps = async() => {
	const votes = await Query.get.list.votes.load(1)
	const newBots = await Query.get.list.new.load(1)
	const trusted = await Query.get.list.trusted.load(1)

	return { props: { votes, newBots, trusted }}

}

interface IndexProps {
	votes: BotList
	newBots: BotList
	trusted: BotList
}

export default Index
