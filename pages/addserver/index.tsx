import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'

import { get } from '@utils/Query'
import { parseCookie} from '@utils/Tools'
import { RawGuild, ServerData, Theme, User } from '@types'

const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const ServerCard = dynamic(() => import('@components/ServerCard'))
const Login = dynamic(() => import('@components/Login'))
const Container = dynamic(() => import('@components/Container'))

const AddBot:NextPage<AddBotProps> = ({ logged, guilds }) => {
	if(!logged) return <Login>
		<NextSeo title='새로운 서버 추가하기' description='자신의 서버를 한국 디스코드 리스트에 등록하세요.' openGraph={{
			title:'새로운 서버 추가하기', description: '자신의 서버를 한국 디스코드 리스트에 등록하세요.'
		}} />
	</Login>
	return <Container paddingTop className='py-5'>
		<NextSeo title='새로운 서버 추가하기' description='자신의 서버를 한국 디스코드 리스트에 등록하세요.' openGraph={{
			title:'새로운 서버 추가하기', description: '자신의 서버를 한국 디스코드 리스트에 등록하세요.'
		}} />
		<h1 className='text-3xl font-bold'>새로운 서버 추가하기</h1>
		<p className='text-gray-400'>관리자이신 서버 목록입니다.</p>
		<p className='text-gray-400 pb-5'>봇을 초대한 뒤 새로고침 해주세요. 또한, 반영까지 최대 1분이 소요될 수 있습니다.</p>
		<ResponsiveGrid>
			{
				guilds.sort((a ,b) => (+!!b.data || 0) - (+!!a.data || 0)).map(g => (
					<ServerCard type={g.exists ? 'manage' : 'add'} server={g} key={g.id} />
				))
			}
		</ResponsiveGrid>
	</Container>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token)
	const guilds = (await get.userGuilds.load(user || ''))?.filter(g=> (g.permissions & 8) || g.owner).map(async g => {
		const server = (await get.server.load(g.id))
		const data = await get.serverData(g.id)
		return { ...g, ...(server || {}), ...((+new Date() - +new Date(data?.updatedAt)) < 2 * 60 * 1000  ? { data } : {}), members: data?.memberCount || null, exists: !!server }
	})
	return { props: { logged: !!user || !guilds, user: await get.user.load(user || ''), guilds: guilds && (await Promise.all(guilds)).filter(g => !g?.exists) } }
}

interface AddBotProps {
	logged: boolean
	user: User
	csrfToken: string
	theme: Theme
	guilds: (RawGuild & { data: ServerData, exists?: boolean })[]
}

export default AddBot