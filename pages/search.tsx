import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

import { BotList } from '@types'
import { get } from '@utils/Query'
import { SearchQuerySchema } from '@utils/Yup'
import { redirectTo } from '@utils/Tools'


const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const SEO = dynamic(() => import('@components/SEO'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Container = dynamic(() => import('@components/Container'))
const Paginator = dynamic(() => import('@components/Paginator'))

const Search:NextPage<SearchProps> = ({ data, query }) => {
	const router = useRouter()
	if(!query?.q) {
		redirectTo(router, '/')
		return
	}
	return <>
		<Hero header={`"${query.q}" 검색 결과`} description={`'${query.q}' 에 대한 검색 결과입니다.`} />
		<SEO title={`"${query.q}" 검색 결과`} description={`'${query.q}' 에 대한 검색 결과입니다.`} />
		<Container>
			<Advertisement />
			{ !data || data.data.length === 0 ? <h1 className='text-3xl font-bold text-center py-20'>검색 결과가 없습니다.</h1> :
				<>
					<div className='grid gap-x-4 2xl:grid-cols-4 md:grid-cols-2 mt-20'>
						{
							data.data.map(bot => <BotCard key={bot.id} bot={bot} /> )
						}
					</div>
					<Paginator totalPage={data.totalPage} currentPage={data.currentPage} pathname={`/search?q=${query.q}`} />
				</>
			}
			<Advertisement />
		</Container>
	</>
}

export const getServerSideProps = async(ctx: Context) => {
	let data: BotList
	if(!ctx.query.page) ctx.query.page = '1'
	const validate = await SearchQuerySchema.validate(ctx.query).then(el => el).catch(() => null)
	if(!validate || isNaN(Number(ctx.query.page))) data = null
	else data = await get.list.search.load(JSON.stringify({ query: ctx.query.q, page: ctx.query.page }))

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
  q: string
  page?: string
}

export default Search