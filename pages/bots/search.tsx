import { NextPage, NextPageContext } from 'next'
import type { FC } from 'react'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'

import { List, Bot } from '@types'
import { get } from '@utils/Query'
import { SearchQuerySchema } from '@utils/Yup'
import { KoreanbotsEndPoints } from '@utils/Constants'

const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Container = dynamic(() => import('@components/Container'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const Paginator = dynamic(() => import('@components/Paginator'))
const LongButton = dynamic(() => import('@components/LongButton'))
const Redirect = dynamic(() => import('@components/Redirect'))

const SearchComponent: FC<{ data: List<Bot>; query: URLQuery }> = ({ data, query }) => {
	return (
		<div className='py-10'>
			{!data || data.data.length === 0 ? (
				<h1 className='py-20 text-center text-3xl font-bold'>검색 결과가 없습니다.</h1>
			) : (
				<>
					<ResponsiveGrid>
						{data.data.map((el) => (
							<BotCard key={el.id} bot={el as Bot} />
						))}
					</ResponsiveGrid>
					<Paginator
						totalPage={data.totalPage}
						currentPage={data.currentPage}
						pathname='/search'
						searchParams={query}
					/>
				</>
			)}
		</div>
	)
}
const Search: NextPage<SearchProps> = ({ botData, query }) => {
	if (!query?.q) return <Redirect text={false} to='/' />
	return (
		<>
			<Hero
				type='bots'
				header={`"${query.q}" 검색 결과`}
				description={`'${query.q}' 에 대한 검색 결과입니다.`}
			/>
			<Container>
				<section id='list'>
					<Advertisement />
					<h1 className='text-4xl font-bold'>봇</h1>
					<SearchComponent data={botData} query={query} />
					<h1 className='py-10 text-2xl font-bold'>서버를 찾으시나요?</h1>
					<LongButton center href={KoreanbotsEndPoints.URL.searchServer(query.q)}>
						서버 검색 결과 보기
					</LongButton>
					<Advertisement />
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
				query: ctx.query,
			},
		}
	}
}

interface SearchProps {
	botData?: List<Bot>
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
