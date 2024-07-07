import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'

import { get } from '@utils/Query'
import { Bot, List } from '@types'
import { ParsedUrlQuery } from 'querystring'
import { PageCount } from '@utils/Yup'

const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Container = dynamic(() => import('@components/Container'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))

const Trusted: NextPage<TrustedProps> = ({ data }) => {
	return (
		<>
			<Hero
				type='bots'
				header='신뢰된 봇'
				description='한국 디스코드 리스트에서 엄격한 기준을 통과한 봇들입니다!'
			/>
			<Container className='pb-10'>
				<Advertisement />
				<ResponsiveGrid>
					{data.data.map((bot) => (
						<BotCard key={bot.id} bot={bot} />
					))}
				</ResponsiveGrid>
				{/* <Paginator
					totalPage={data.totalPage}
					currentPage={data.currentPage}
					pathname='/bots/list/trusted'
				/> */}
				<Advertisement />
			</Container>
		</>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	let data: List<Bot>
	if (!ctx.query.page) ctx.query.page = '1'
	const validate = await PageCount.validate(ctx.query.page)
		.then((el) => el)
		.catch(() => null)
	if (!validate || isNaN(Number(ctx.query.page))) data = null
	else data = await get.list.trusted.load(Number(ctx.query.page))
	return {
		props: {
			data,
		},
	}
}

interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	page: string
}

interface TrustedProps {
	data: List<Bot>
}

export default Trusted
