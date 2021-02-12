import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'

import { BotList } from '@types'
import { get } from '@utils/Query'
import { PageCount } from '@utils/Yup'
import NotFound from './404'

const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const SEO = dynamic(() => import('@components/SEO'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Container = dynamic(() => import('@components/Container'))
const Paginator = dynamic(() => import('@components/Paginator'))

const Search:NextPage<SearchProps> = ({ data, query }) => {
	if(!data || data.data.length === 0) return <NotFound />
	return <>
		<Hero header={`"${query.query}" 검색 결과`} description={`'${query.query}' 에 대한 검색 결과입니다.`} />
		<SEO title={`"${query.query}" 검색 결과`} description={`'${query.query}' 에 대한 검색 결과입니다.`} />
		<Container>
			<Advertisement />
			<div className='grid gap-x-4 2xl:grid-cols-4 md:grid-cols-2 mt-20'>
				{
					data.data.map(bot => <BotCard key={bot.id} bot={bot} /> )
				}
			</div>
			<Paginator totalPage={data.totalPage} currentPage={data.currentPage} pathname={`/search?query=${query.query}`} />
			<Advertisement />
		</Container>
	</>
}

export const getServerSideProps = async(ctx: Context) => {
	let data: BotList
	if(!ctx.query.page) ctx.query.page = '1'
	const validate = await PageCount.validate(ctx.query.page).then(el => el).catch(() => null)
	if(!validate || isNaN(Number(ctx.query.page))) data = null
	else data = await get.list.search.load(JSON.stringify({ query: ctx.query.query, page: ctx.query.page }))

	return {
		props: {
			data,
			query: ctx.query
		}
	}
}


interface SearchProps {
  data: BotList,
  query: URLQuery
}

interface Context extends NextPageContext {
  query: URLQuery  
}

interface URLQuery extends ParsedUrlQuery {
  query: string
  page?: string
}

export default Search