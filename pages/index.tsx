import { NextPage, NextPageContext } from 'next'
import Advertisement from '../components/Advertisement'
import BotCard from '../components/BotCard'
import Container from '../components/Container'
import LongButton from '../components/LongButton'
import Wave from '../components/Wave'
import { BotList } from '../types'
import { Fetch } from '../utils'

const Index: NextPage<IndexProps> = ({ votes, newBots, trusted }) => {
	return (
		<>
			<div className='dark:bg-discord-black bg-discord-blurple'>
				<Container className='pb-28 pt-20' ignoreColor>
					<h1 className='text-center text-gray-100 text-3xl font-bold sm:text-left'>
						한국 디스코드봇 리스트
					</h1>
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
				<a className='mx-auto w-1/2 justify-center text-2xl bg-little-white dark:bg-discord-black text-black dark:text-gray-400 rounded flex hover:bg-little-white-hover dark:hover:bg-discord-dark-hover cursor-pointer px-4 py-4 mb-1'>
					더보기
				</a>
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
	const votes = await Fetch.botListVotes.load(1)
	const newBots = await Fetch.botListNew.load(1)
	const trusted = await Fetch.botListTrusted.load(1)

	return { props: { votes, newBots, trusted }}

}

interface IndexProps {
	votes: BotList
	newBots: BotList
	trusted: BotList
}

export default Index
