import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'

import { get } from '@utils/Query'
import { Server, List } from '@types'
import { serverCategoryListArgumentSchema } from '@utils/Yup'
import NotFound from 'pages/404'

const Hero = dynamic(() => import('@components/Hero'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const ServerCard = dynamic(() => import('@components/ServerCard'))
const Container = dynamic(() => import('@components/Container'))
const Paginator = dynamic(() => import('@components/Paginator'))

const Category: NextPage<CategoryProps> = ({ data, query }) => {
	if(!data || data.data.length === 0 || data.totalPage < Number(query.page)) return <NotFound message={data?.data.length === 0 ? '해당 카테고리에 해당되는 서버가 존재하지 않습니다.' : null} />
	return <>
		<Hero type='servers' header={`${query.category} 카테고리 서버들`} description={`다양한 "${query.category}" 카테고리의 서버들을 만나보세요.`} />
		<Container>
			<Advertisement />
			<ResponsiveGrid>
				{
					data.data.map(server => <ServerCard type='list' key={server.id} server={server} /> )
				}
			</ResponsiveGrid>
			<Paginator totalPage={data.totalPage} currentPage={data.currentPage} pathname={`/servers/categories/${query.category}`} />
			<Advertisement />
		</Container>
	</>
}

export const getServerSideProps = async (ctx: Context) => {
	let data: List<Server>
	if(!ctx.query.page) ctx.query.page = '1'
	const validate = await serverCategoryListArgumentSchema.validate(ctx.query).then(el => el).catch(() => null)
	if(!validate || isNaN(Number(ctx.query.page))) data = null
	else data = await get.serverList.category.load(JSON.stringify({ page: Number(ctx.query.page), category: ctx.query.category }))
	return {
		props: {
			data,
			query: ctx.query
		}
	}
}

interface CategoryProps {
  data: List<Server>
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