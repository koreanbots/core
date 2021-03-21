import { NextPage, NextPageContext } from 'next'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { get } from '@utils/Query'
import { parseCookie, redirectTo } from '@utils/Tools'
import { Bot, SubmittedBot, User } from '@types'
import BotCard from '@components/BotCard'
import SubmittedBotCard from '@components/SubmittedBotCard'
import Button from '@components/Button'

const Container = dynamic(() => import('@components/Container'))
const SEO = dynamic(() => import('@components/SEO'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))

const Panel:NextPage<PanelProps> = ({ logged, user, submits }) => {
	const router = useRouter()
	const [ submitLimit, setSubmitLimit ] = useState(8)
	function toLogin() {
		localStorage.redirectTo = window.location.href
		redirectTo(router, 'login')
	}
	if(!logged) {
		toLogin()
		return <SEO title='관리 패널' />
	}
	return <Container paddingTop className='pt-5 pb-10'>
		<SEO title='관리 패널' />
		<h1 className='text-3xl font-bold'>관리 패널</h1>
		<div className='mt-6'>
			<h2 className='text-2xl font-bold'>나의 봇</h2>
			<ResponsiveGrid>
				{
					(user.bots as Bot[]).map(bot=> <BotCard key={bot.id} bot={bot} manage />)
				}
			</ResponsiveGrid>
		</div>
		<div className='mt-6'>
			<h2 className='text-2xl font-bold'>봇 심사이력</h2>
			<p className='text-left text-gray-400 text-sm font-medium'>자세히 보려면 카드를 클릭하세요.</p>
			<div className='grid gap-4 2xl:grid-cols-4 lg:grid-cols-2 mt-12'>
				{
					submits.slice(0, submitLimit).map(el=> <SubmittedBotCard key={el.date} href={`/pendingBots/${el.id}/${el.date}`} submit={el} />)
				}
			</div>
			{
				submitLimit < submits.length && <div className='text-center pt-4'>
					<Button onClick={() => setSubmitLimit(submitLimit+8)}>더보기</Button>
				</div>
			}
		</div>
	</Container>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token) || ''
	const submits = await get.botSubmits.load(user)

	return { props: { logged: !!user, user:  await get.user.load(user), submits } }
}

interface PanelProps {
  logged: boolean
  user: User
  submits: SubmittedBot[]
}

export default Panel