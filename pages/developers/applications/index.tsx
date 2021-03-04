import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { get } from '@utils/Query'
import { parseCookie, redirectTo } from '@utils/Tools'

import { Bot, User } from '@types'

const Application = dynamic(() => import('@components/Application'))
const DeveloperLayout = dynamic(() => import('@components/DeveloperLayout'))

const Applications: NextPage<ApplicationsProps> = ({ user }) => {
	const router = useRouter()
	if(!user) {
		localStorage.redirectTo = window.location.href
		redirectTo(router, 'login')
		return
	}
	return <DeveloperLayout enabled='applications'>
		<h1 className='text-3xl font-bold'>나의 봇</h1>
		<p className='text-gray-400'>한국 디스코드봇 리스트 API를 활용하여 봇에 다양한 기능을 추가해보세요.</p>
		<div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-2'>
			{
				(user.bots as Bot[]).map(bot => <Application key={bot.id} id={bot.id} name={bot.name} type='bot' />)
			}
		</div>
	</DeveloperLayout>

}

interface ApplicationsProps {
  user: User
}

export const getServerSideProps = async (ctx: NextPageContext) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token) || ''

	return {
		props: { user: await get.user.load(user) }
	}
}
export default Applications