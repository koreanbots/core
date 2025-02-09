import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'
import type { FC } from 'react'

import { Bot, List, Server } from '@types'
import { KoreanbotsEndPoints } from '@utils/Constants'
import { get } from '@utils/Query'
import { SearchQuerySchema } from '@utils/Yup'

const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const BotCard = dynamic(() => import('@components/BotCard'))
const ServerCard = dynamic(() => import('@components/ServerCard'))
const Container = dynamic(() => import('@components/Container'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const LongButton = dynamic(() => import('@components/LongButton'))
const Redirect = dynamic(() => import('@components/Redirect'))

const SearchComponent: FC<{
	data: List<Bot | Server>
	query: URLQuery
	type: 'bot' | 'server'
}> = ({ data, query, type }) => {
	return (
		<div className='py-20'>
			<h1 className='text-4xl font-bold'>{type === 'bot' ? '봇' : '서버'}</h1>
			{!data || data.data.length === 0 ? (
				<h1 className='py-20 text-center text-3xl font-bold'>검색 결과가 없습니다.</h1>
			) : (
				<>
					<ResponsiveGrid>
						{data.data.map((el) =>
							type === 'bot' ? (
								<BotCard key={el.id} bot={el as Bot} />
							) : (
								<ServerCard key={el.id} type='list' server={el as Server} />
							)
						)}
					</ResponsiveGrid>
					{data.totalPage !== 1 && (
						<LongButton
							center
							href={
								type === 'bot'
									? KoreanbotsEndPoints.URL.searchBot(query.q)
									: KoreanbotsEndPoints.URL.searchServer(query.q)
							}
						>
							더보기
						</LongButton>
					)}
				</>
			)}
		</div>
	)
}
const Search: NextPage<SearchProps> = ({ botData, serverData, priority, query }) => {
	if (!query?.q) return <Redirect text={false} to='/' />
	const list: ('bot' | 'server')[] = ['bot', 'server']
	const resultNotExists =
		(!botData || botData.data.length === 0) && (!serverData || serverData.data.length === 0)
	return (
		<>
			<Hero
				type={priority ? (priority === 'bot' ? 'bots' : 'servers') : 'all'}
				header={`"${query.q}" 검색 결과`}
				description={`'${query.q}' 에 대한 검색 결과입니다.`}
			/>
			<Container>
				<section id='list'>
					<Advertisement disabled={resultNotExists} />
					{(priority === 'server' ? list.reverse() : list).map((el) => (
						<SearchComponent
							key={el}
							data={el === 'bot' ? botData : serverData}
							query={query}
							type={el}
						/>
					))}
					<Advertisement disabled={resultNotExists} />
				</section>
			</Container>
		</>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	if (ctx.query.query && !ctx.query.q) ctx.query.q = ctx.query.query
	if (!ctx.query?.q) {
		return {
			redirect: {
				destination: '/',
				permanent: true,
			},
			props: {},
		}
	}
	if (!ctx.query.page) ctx.query.page = '1'
	const validate = await SearchQuerySchema.validate(ctx.query)
		.then((el) => el)
		.catch(() => null)
	if (!validate || isNaN(Number(ctx.query.page))) return { props: { query: ctx.query } }
	else {
		return {
			props: {
				botData: await get.list.search
					.load(JSON.stringify({ query: ctx.query.q || '', page: ctx.query.page }))
					.then((el) => el)
					.catch(() => null),
				serverData: await get.serverList.search
					.load(JSON.stringify({ query: ctx.query.q || '', page: ctx.query.page }))
					.then((el) => el)
					.catch(() => null),
				query: ctx.query,
				priority: validate.priority || null,
			},
		}
	}
}

interface SearchProps {
	botData?: List<Bot>
	serverData?: List<Server>
	priority?: 'bot' | 'server'
	query: URLQuery
}

interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	q?: string
	query?: string
	page?: string
}

export default Search
