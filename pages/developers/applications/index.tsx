import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'

import { get } from '@utils/Query'
import { parseCookie } from '@utils/Tools'

import { Bot, Server, User } from '@types'

const Application = dynamic(() => import('@components/Application'))
const DeveloperLayout = dynamic(() => import('@components/DeveloperLayout'))
const Login = dynamic(() => import('@components/Login'))

const Applications: NextPage<ApplicationsProps> = ({ user }) => {
	if(!user) return <Login>
		<NextSeo title='한디리 개발자' description='한국 디스코드 리스트 API를 활용하여 봇에 다양한 기능을 추가해보세요.' />
	</Login>
	return <DeveloperLayout enabled='applications'>
		<h1 className='text-3xl font-bold'>나의 봇</h1>
		<p className='text-gray-400'>한국 디스코드 리스트 API를 활용하여 봇에 다양한 기능을 추가해보세요.</p>
		<div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-2'>
			{
				(user.bots as Bot[]).map(bot => <Application key={bot.id} id={bot.id} name={bot.name} type='bot' />)
			}
		</div>
		<h1 className='text-3xl font-bold mt-10'>나의 서버</h1>
		<p className='text-gray-400'>한국 디스코드 리스트 API를 활용하여 서버에 다양한 기능을 추가해보세요.</p>
		<div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-2'>
			{
				(user.servers as Server[]).map(bot => <Application key={bot.id} id={bot.id} name={bot.name} type='server' />)
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