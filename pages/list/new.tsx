import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import { get } from '@utils/Query'
import { BotList } from '@types'

const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const SEO = dynamic(() => import('@components/SEO'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Container = dynamic(() => import('@components/Container'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))

const New:NextPage<NewProps> = ({ data }) => {
	return <>
		<Hero header='새로운 봇' description='최근에 한국 디스코드봇 리스트에 추가된 봇들입니다!' />
		<SEO title='새로운 봇' description='최근에 추가된 봇들입니다!' />
		<Container className='pb-10'>
			<Advertisement />
			<ResponsiveGrid>
				{
					data.data.map(bot => <BotCard key={bot.id} bot={bot} /> )
				}
			</ResponsiveGrid>
			<Advertisement />
		</Container>
	</>
}

export const getServerSideProps = async () => {
	const data = await get.list.new.load(1)
	return {
		props: {
			data
		}
	}
}

interface NewProps {
  data: BotList
}

export default New