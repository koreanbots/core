import { NextPage, NextPageContext } from 'next'
import type { FC } from 'react'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'

import { List, Server } from '@types'
import { get } from '@utils/Query'
import { SearchQuerySchema } from '@utils/Yup'
import { KoreanbotsEndPoints } from '@utils/Constants'


const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const ServerCard = dynamic(() => import('@components/ServerCard'))
const Container = dynamic(() => import('@components/Container'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const Paginator = dynamic(() => import('@components/Paginator'))
const LongButton = dynamic(() => import('@components/LongButton'))
const Redirect = dynamic(() => import('@components/Redirect'))

const SearchComponent: FC<{data: List<Server>, query: URLQuery }> = ({ data, query }) => {
	return <div className='py-10'>
		{ !data || data.data.length === 0 ? <h1 className='text-3xl font-bold text-center py-20'>검색 결과가 없습니다.</h1> :
			<>
				<ResponsiveGrid>
					{
						data.data.map(el => <ServerCard key={el.id} type='list' server={el as Server} /> )
					}
				</ResponsiveGrid>
				<Paginator totalPage={data.totalPage} currentPage={data.currentPage} pathname='/search' searchParams={query} />
			</>
		}
	</div>
}
const Search:NextPage<SearchProps> = ({ serverData, query }) => {
	if(!query?.q) return <Redirect text={false} to='/' />
	return <>
		<Hero type='servers' header={`"${query.q}" 검색 결과`} description={`'${query.q}' 에 대한 검색 결과입니다.`} />
		<Container>
			<section id='list'>
				<Advertisement />
				<h1 className='text-4xl font-bold'>서버</h1>
				<SearchComponent data={serverData} query={query} />
				<h1 className='text-2xl font-bold py-10'>봇을 찾으시나요?</h1>
				<LongButton center href={KoreanbotsEndPoints.URL.searchBot(query.q)}>봇 검색 결과 보기</LongButton>
				<Advertisement />
			</section>
		</Container>
	</>
}

export const getServerSideProps = async(ctx: Context) => {
	if(ctx.query.query && !ctx.query.q) ctx.query.q = ctx.query.query
	if(!ctx.query?.q) {
		ctx.res.statusCode = 301
		ctx.res.setHeader('Location', '/')
		return { props: {} }
	}
	if(!ctx.query.page) ctx.query.page = '1'
	const validate = await SearchQuerySchema.validate(ctx.query).then(el => el).catch(() => null)
	if(!validate || isNaN(Number(ctx.query.page))) return { props: { query: ctx.query } }
	else {
		return {
			props: {
				serverData: await get.serverList.search.load(JSON.stringify({ query: ctx.query.q || '', page: ctx.query.page })).then(el => el).catch(() => null),
				query: ctx.query
			}
		}
	}
}


interface SearchProps {
  serverData?: List<Server>
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