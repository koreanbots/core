
import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { SnowflakeUtil } from 'discord.js'
import { ParsedUrlQuery } from 'querystring'
import { josa } from 'josa'

import { Bot, User, Theme, Server } from '@types'
import { get } from '@utils/Query'
import { checkUserFlag, parseCookie } from '@utils/Tools'
import { getToken } from '@utils/Csrf'

import NotFound from '../../404'
import { KoreanbotsEndPoints } from '@utils/Constants'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

const Container = dynamic(() => import('@components/Container'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const Divider = dynamic(() => import('@components/Divider'))
const BotCard = dynamic(() => import('@components/BotCard'))
const ServerCard = dynamic(() => import('@components/ServerCard'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const Tag = dynamic(() => import('@components/Tag'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Tooltip = dynamic(() => import('@components/Tooltip'))

const Users: NextPage<UserProps> = ({ user, data }) => {
	const router = useRouter()
	if (!data?.id) return <NotFound />
	return (
		<Container paddingTop className='py-10'>
			<NextSeo
				title={data.globalName}
				description={data.bots.length === 0 ? `${data.globalName}님의 프로필입니다.` : josa(
					`${(data.bots as Bot[])
						.slice(0, 5)
						.map(el => el.name)
						.join(', ')}#{을} 제작합니다.`
				)}
				openGraph={{
					images: [{
						url: KoreanbotsEndPoints.CDN.avatar(data.id, { format: 'png', size: 256 }),
						width: 256,
						height: 256,
						alt: 'User Avatar'
					}]
				}}
			/>
			<div className='lg:flex'>
				<div className='w-3/5 mx-auto text-center lg:w-1/6'>
					<DiscordAvatar
						size={512}
						userID={data.id}
						className='w-full rounded-full'
					/>
				</div>
				<div className='grow px-5 py-10 w-full text-center lg:w-5/12 lg:text-left'>
					<div>
						{
							(data.tag !== '0') ? <div className='lg:flex mt-3 mb-1 '>
								<h1 className='text-4xl font-bold'>{data.globalName}</h1>
								<span className='ml-0.5 text-gray-400 text-3xl font-semibold mt-1'>#{data.tag}</span>
							</div> : <div className='lg:flex mt-3 mb-1 flex-col'>
								<h1 className='text-4xl font-bold'>{data.globalName}</h1>
								<span className='text-gray-400 text-2xl font-semibold mt-1'>@{data.username}</span>
							</div>
						}
						<div className='badges flex mb-2 justify-center lg:justify-start'>
							{checkUserFlag(data.flags, 'staff') && (
								<Tooltip text='한국 디스코드 리스트 스탭입니다.' direction='left'>
									<div className='pr-5 text-koreanbots-blue text-2xl'>
										<i className='fas fa-hammer' />
									</div>
								</Tooltip>
							)}
							{checkUserFlag(data.flags, 'bughunter') && (
								<Tooltip text='버그를 많이 제보해주신 분입니다.' direction='left'>
									<div className='pr-5 text-emerald-500 text-2xl'>
										<i className='fas fa-bug' />
									</div>
								</Tooltip>
							)}
						</div>
						{data.github && (
							<Tag
								newTab
								text={
									<>
										<i className='fab fa-github' /> {data.github}
									</>
								}
								github
								href={`https://github.com/${data.github}`}
							/>
						)}
						{
							user?.id !== data.id && <div className='list-none mt-2'>
								<Link href={`/users/${router.query.id}/report`}>
									<a className='text-red-600 hover:underline cursor-pointer' aria-hidden='true'>
										<i className='far fa-flag' />신고하기
									</a>
								</Link>
							</div>
						}
					</div>
				</div>
			</div>
			<Divider />
			<h2 className='mt-8 pb-4 text-3xl font-bold'>소유한 봇</h2>
			
			{data.bots.length === 0 ? <h2 className='text-xl'>소유한 봇이 없습니다.</h2> : 
				<ResponsiveGrid>
					{
						(data.bots as Bot[]).filter(el => el.state !== 'blocked').map((bot: Bot) => (
							<BotCard key={bot.id} bot={bot} />
						))
					}
				</ResponsiveGrid>
			}
			
			<h2 className='py-4 text-3xl font-bold'>소유한 서버</h2>
			{data.servers.length === 0 ? <h2 className='text-xl'>소유한 서버가 없습니다.</h2> :
				<ResponsiveGrid>
					{
						(data.servers as Server[]).map((server: Server) => (
							<ServerCard type='list' key={server.id} server={server} />
						))
					}
				</ResponsiveGrid>
			}
			<Advertisement />
		</Container>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	
	const user = await get.Authorization(parsed?.token) || ''
	const data = await get.user.load(ctx.query.id)
	return { props: { user: await get.user.load(user) || {}, data, date: Number(SnowflakeUtil.deconstruct(data?.id ?? '0')?.timestamp), csrfToken: getToken(ctx.req, ctx.res) } }
}

interface UserProps {
	user: User
	data: User
	csrfToken: string
	theme: Theme
}

interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}

export default Users
