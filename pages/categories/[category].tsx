import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'

import { get } from '@utils/Query'
import { BotList } from '@types'
import { botCategoryListArgumentSchema } from '@utils/Yup'
import NotFound from 'pages/404'
import { useState } from 'react'

const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const SEO = dynamic(() => import('@components/SEO'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Container = dynamic(() => import('@components/Container'))
const Paginator = dynamic(() => import('@components/Paginator'))
const NSFW = dynamic(() => import('@components/NSFW'))

const Category: NextPage<CategoryProps> = ({ data, query }) => {
	const [ nsfw, setNSFW ] = useState(localStorage.nsfw)
	if(!data || data.data.length === 0 || data.totalPage < Number(query.page)) return <NotFound />
	return <>
		<Hero header={`${query.category} 카테고리 봇들`} description={`다양한 "${query.category}" 카테고리의 봇들을 만나보세요.`} />
		<SEO title={`${query.category} 카테고리 봇들`} description={`다양한 ${query.category} 카테고리의 봇들을 만나보세요.`} />
		{
			query.category === 'NSFW' && !nsfw ? <NSFW onClick={() => {
				localStorage.nsfw = true
				setNSFW(true)
			}} /> : <Container>
				<Advertisement />
				<ResponsiveGrid>
					{
						data.data.map(bot => <BotCard key={bot.id} bot={bot} /> )
					}
				</ResponsiveGrid>
				<Paginator totalPage={data.totalPage} currentPage={data.currentPage} pathname={`/categories/${query.category}`} />
				<Advertisement />
			</Container>
		}
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