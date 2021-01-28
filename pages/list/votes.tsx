import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'

import { BotList } from '@types'
import * as Query from '@utils/Query'

import NotFound from '../404'
import { PageCount } from '@utils/Yup'
import { useRouter } from 'next/router'

const Advertisement = dynamic(()=> import('@components/Advertisement'))
const BotCard = dynamic(()=> import('@components/BotCard'))
const Container = dynamic(()=> import('@components/Container'))
const Paginator = dynamic(()=> import('@components/Paginator'))

const Votes:NextPage<VotesProps> = ({ data }) => {
	const router = useRouter()
	if(!data || data.data.length === 0 || data.totalPage < Number(router.query.page)) return <NotFound />
	return <Container paddingTop>
		<h1 className='text-3xl font-bold mt-5'>
			<i className='far fa-heart mr-3 text-pink-600' /> 하트 랭킹 - {data.currentPage}페이지
		</h1>
		<p className='text-base'>하트를 많이 받은 봇들의 순위입니다!</p>
		<Advertisement />
		<div className='grid gap-4 2xl:grid-cols-4 md:grid-cols-2 mt-20'>
			{
				data.data.map(bot => <BotCard key={bot.id} bot={bot} /> )
			}
		</div>
		<Paginator totalPage={data.totalPage} currentPage={data.currentPage} pathname='/list/votes' />
	</Container>
}
export const getServerSideProps = async (ctx:Context) => {
	let data: BotList
	console.log(ctx.query.page)
	if(!ctx.query.page) ctx.query.page = '1'
	const validate = await PageCount.validate(ctx.query.page).then(el => el).catch(() => null)
	console.log(validate)
	if(!validate || isNaN(Number(ctx.query.page))) data = null
	else data = await Query.get.list.votes.load(Number(ctx.query.page))
	return {
		props: {
			data
		}
	}
}

interface VotesProps {
  data: BotList
}

interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	page: string
}

export default Votes
