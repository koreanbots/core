import { NextPage, NextPageContext } from 'next'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { get } from '@utils/Query'
import { parseCookie } from '@utils/Tools'
import { Bot, SubmittedBot, User } from '@types'
import Fetch from '@utils/Fetch'
import { getToken } from '@utils/Csrf'

const Container = dynamic(() => import('@components/Container'))
const SEO = dynamic(() => import('@components/SEO'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const Button = dynamic(() => import('@components/Button'))
const BotCard = dynamic(() => import('@components/BotCard'))
const SubmittedBotCard = dynamic(() => import('@components/SubmittedBotCard'))
const Login = dynamic(() => import('@components/Login'))

const Panel:NextPage<PanelProps> = ({ logged, user, submits, csrfToken }) => {
	const router = useRouter()
	const [ submitLimit, setSubmitLimit ] = useState(8)
	if(!logged) return <Login>
		<SEO title='관리 패널' />
	</Login>
	return <Container paddingTop className='pt-5 pb-10'>
		<SEO title='관리 패널' />
		<h1 className='text-4xl font-bold'>관리 패널</h1>
		<h2 className='text-2xl font-bold mt-4'>깃허브 계정 연동</h2>
		<p className='text-gray-400 mb-2'>연동한 깃허브 계정은 프로필에 표시됩니다.</p>
		<Button className={`${user.github ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-github-black'} hover:opacity-80`} onClick={user.github ? async () => {
			await Fetch('/api/auth/github', {
				method: 'DELETE',
				body: JSON.stringify({
					_csrf: csrfToken
				})
			}, true)
			router.reload()
		} : null} href={user.github ? null : '/api/auth/github'}>
			<i className='fab fa-github' /> 깃허브 계정 연동 {user.github ? '취소' : ''}
		</Button>
		<div className='mt-6'>
			<h2 className='text-3xl font-bold'>나의 봇</h2>
			{
				user.bots.length === 0 ? <h2 className='text-xl'>소유한 봇이 없습니다.</h2> :
					<ResponsiveGrid>
						{
							(user.bots as Bot[]).map(bot=> <BotCard key={bot.id} bot={bot} manage />)
						}
					</ResponsiveGrid>
			}
		</div>
		<div className='mt-6'>
			<h2 className='text-3xl font-bold'>봇 심사이력</h2>
			{
				submits.length === 0 ? <h2 className='text-xl'>심사이력이 없습니다.</h2> : 
					<>
						<p className='text-left text-gray-400 text-sm font-medium'>자세히 보려면 카드를 클릭하세요.</p>
						<div className='grid gap-4 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-12'>
							{
								submits.slice(0, submitLimit).map(el=> <SubmittedBotCard key={el.date} href={`/pendingBots/${el.id}/${el.date}`} submit={el} />)
							}
						</div>
						{
							submitLimit < submits.length && <div className='text-center pt-4'>
								<Button onClick={() => setSubmitLimit(submitLimit+8)}>더보기</Button>
							</div>
						}
					</>
			}
			
		</div>
	</Container>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token) || ''
	const submits = await get.botSubmits.load(user)

	return { props: { logged: !!user, user:  await get.user.load(user), submits, csrfToken: getToken(ctx.req, ctx.res) } }
}

interface PanelProps {
  logged: boolean
  user: User
  submits: SubmittedBot[]
	csrfToken: string
}

export default Panel