import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'

import { get } from '@utils/Query'
import { BotList } from '@types'
import { botCategoryListArgumentSchema } from '@utils/Yup'
import NotFound from 'pages/404'

const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const SEO = dynamic(() => import('@components/SEO'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Container = dynamic(() => import('@components/Container'))
const Paginator = dynamic(() => import('@components/Paginator'))

const Category: NextPage<CategoryProps> = ({ data, query }) => {
	if(!data || data.data.length === 0 || data.totalPage < Number(query.page)) return <NotFound />
	return <>
		<Hero header={`${query.category} 카테고리 봇들`} description={`다양한 "${query.category}" 카테고리의 봇들을 만나보세요.`} />
		<SEO title={`${query.category} 카테고리 봇들`} description={`다양한 ${query.category} 카테고리의 봇들을 만나보세요.`} />

		<Container>
			<Advertisement />
			<div className='grid gap-x-4 2xl:grid-cols-4 md:grid-cols-2 mt-20'>
				{
					data.data.map(bot => <BotCard key={bot.id} bot={bot} /> )
				}
			</div>
			<Paginator totalPage={data.totalPage} currentPage={data.currentPage} pathname={`/categories/${query.category}`} />
			<Advertisement />
		</Container>
	</>
}

export const getServerSideProps = async (ctx: Context) => {
	let data: BotList
	if(!ctx.query.page) ctx.query.page = '1'
	const validate = await botCategoryListArgumentSchema.validate(ctx.query).then(el => el).catch(() => null)
	if(!validate || isNaN(Number(ctx.query.page))) data = null
	else data = await get.list.category.load(JSON.stringify({ page: Number(ctx.query.page), category: ctx.query.category }))
	return {
		props: {
			data,
			query: ctx.query
		}
	}
}

interface CategoryProps {
  data: BotList
  query: URLQuery
}

interface Context extends NextPageContext {
  query: URLQuery  
}

interface URLQuery extends ParsedUrlQuery {
  category: string
  page?: string
}

export default Category