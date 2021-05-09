import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'

import { BotList } from '@types'
import { get } from '@utils/Query'
import { SearchQuerySchema } from '@utils/Yup'


const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const SEO = dynamic(() => import('@components/SEO'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Container = dynamic(() => import('@components/Container'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const Paginator = dynamic(() => import('@components/Paginator'))
const Redirect = dynamic(() => import('@components/Redirect'))

const Search:NextPage<SearchProps> = ({ data, query }) => {
	if(!query?.q) return <Redirect text={false} to='/' />
	return <>
		<Hero header={`"${query.q}" 검색 결과`} description={`'${query.q}' 에 대한 검색 결과입니다.`} />
		<SEO title={`"${query.q}" 검색 결과`} description={`'${query.q}' 에 대한 검색 결과입니다.`} />
		<section id='list'>
			<Container>
				<Advertisement />
				{ !data || data.data.length === 0 ? <h1 className='text-3xl font-bold text-center py-20'>검색 결과가 없습니다.</h1> :
					<>
						<ResponsiveGrid>
							{
								data.data.map(bot => <BotCard key={bot.id} bot={bot} /> )
							}
						</ResponsiveGrid>
						<Paginator totalPage={data.totalPage} currentPage={data.currentPage} pathname='/search' searchParams={query} />
					</>
				}
				<Advertisement />
			</Container>
		</section>
	</>
}

export const getServerSideProps = async(ctx: Context) => {
	if(!ctx.query?.q) {
		ctx.res.statusCode = 301
		ctx.res.setHeader('Location', '/')
		return { props: {} }
	}
	let data: BotList
	if(!ctx.query.page) ctx.query.page = '1'
	const validate = await SearchQuerySchema.validate(ctx.query).then(el => el).catch(() => null)
	if(!validate || isNaN(Number(ctx.query.page))) data = null
	else data = await get.list.search.load(JSON.stringify({ query: ctx.query.q || '', page: ctx.query.page })).then(el => el).catch(() => null)

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