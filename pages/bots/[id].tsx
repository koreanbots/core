import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { SnowflakeUtil } from 'discord.js'
import { ParsedUrlQuery } from 'querystring'
import { Bot, Theme, User } from '@types'

import { git, Status } from '@utils/Constants'
import { get } from '@utils/Query'
import Day from '@utils/Day'
import { checkBotFlag, checkUserFlag, formatNumber, parseCookie } from '@utils/Tools'

import NotFound from '../404'
import Footer from '@components/Footer'

const Container = dynamic(() => import('@components/Container'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const Divider = dynamic(() => import('@components/Divider'))
const Tag = dynamic(() => import('@components/Tag'))
const Owner = dynamic(() => import('@components/Owner'))
const Segment = dynamic(() => import('@components/Segment'))
const SEO = dynamic(() => import('@components/SEO'))
const LongButton = dynamic(() => import('@components/LongButton'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Tooltip = dynamic(() => import('@components/Tooltip'))
const Markdown = dynamic(() => import ('@components/Markdown'))

const Bots: NextPage<BotsProps> = ({ data, date, user, footerControl, theme, setTheme }) => {
	const router = useRouter()
	if (!data || !data.id) return <NotFound />
	if(data.vanity && data.vanity !== router.query.id) router.push(`/bots/${data.vanity}`)
	else footerControl(false)
	return <div style={checkBotFlag(data.flags, 'trusted') && data.banner ? { background: `linear-gradient(to right, rgba(34, 36, 38, 0.68), rgba(34, 36, 38, 0.68)), url("${data.bg}") center top / cover no-repeat fixed` } : {}}>
		<Container paddingTop className='py-10'>
			<SEO
				title={data.name}
				description={data.intro}
				image={
					data.avatar
						? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=1024`
						: `https://cdn.discordapp.com/embed/avatars/${Number(data.tag) % 5}.png?size=1024`
				}
			/>
			<div className='lg:flex w-full'>
				<div className='w-full text-center lg:w-1/4'>
					<DiscordAvatar
						userID={data.id}
						className='w-full'
					/>
				</div>
				<div className='flex-grow px-5 py-12 w-full text-center lg:w-5/12 lg:text-left'>
					<div>
						<Tag
							circular
							text={
								<>
									<i className={`fas fa-circle text-${Status[data.status]?.color}`} />{' '}
									{Status[data.status]?.text}
								</>
							}
						/>
						<h1 className='mb-2 mt-3 text-4xl font-bold'>
							{data.name}{' '}
							{checkBotFlag(data.flags, 'trusted') ? (
								<Tooltip text='해당봇은 한국 디스코드봇 리스트에서 엄격한 기준을 통과한 봇입니다!' direction='left' size='large' href='/verification'>
									<span className='text-koreanbots-blue text-3xl'>
										<i className='fas fa-award' />
									</span>
								</Tooltip>
							) : ''}
						</h1>
					</div>
					<p className='dark:text-gray-300 text-gray-800 text-base'>{data.intro}</p>
				</div>
				<div className='w-full lg:w-1/4 lg:pt-10'>
					<LongButton
						newTab
						href={
							data.url ??
							`https://discordapp.com/oauth2/authorize?client_id=${data.id}&scope=bot&permissions=0`
						}
					>
						<h4 className='whitespace-nowrap'>
							<i className='fas fa-user-plus text-discord-blurple' /> 초대하기
						</h4>
					</LongButton>
					<LongButton href={`/bots/${router.query.id}/vote`}>
						<h4>
							<i className='fas fa-heart text-red-600' /> 하트 추가
						</h4>
						<span className='ml-1 px-2 py-1 text-center text-black dark:text-gray-400 text-sm bg-little-white-hover dark:bg-very-black rounded-lg'>
							{formatNumber(data.votes)}
						</span>
					</LongButton>
					{
						((data.owners as User[]).find(el => el.id === user.id) || checkUserFlag(user.flags, 'staff')) && <LongButton href={`/manage/${data.id}`}>
							<h4>
								<i className='fas fa-cogs' /> 관리하기
							</h4>
						</LongButton>
					}
				</div>
			</div>
			<Divider className='px-5' />
			<div className='lg:flex lg:flex-row-reverse'>
				<div className='mb-1 w-full lg:w-1/4'>
					<h2 className='3xl mb-2 font-bold'>정보</h2>
					<div className='grid gap-4 grid-cols-2 px-4 py-4 text-black dark:text-gray-400 dark:bg-discord-black bg-little-white rounded-sm'>
						<div>
							<i className='far fa-flag' /> 접두사
						</div>
						<div className='markdown-body text-black dark:text-gray-400'>
							<code>{data.prefix}</code>
						</div>
						<div>
							<i className='fas fa-users' /> 서버수
						</div>
						<div>{data.servers}</div>
						<div>
							<i className='fas fa-calendar-day' /> 봇 생성일
						</div>
						<div>{Day(date).fromNow(false)}</div>
						{
							checkBotFlag(data.flags, 'trusted') ?
								<Tooltip direction='left' text='해당 봇은 디스코드측에서 인증된 봇입니다.'>
									<div>
										<i className='fas fa-check text-discord-blurple' /> 디스코드 인증됨
									</div>
								</Tooltip>
								: ''
						}
					</div>
					<h2 className='3xl mb-2 mt-2 font-bold'>카테고리</h2>
					<div className='flex flex-wrap'>
						{data.category.map(el => (
							<Tag key={el} text={el} href={`/categories/${el}`} />
						))}
					</div>
					<h2 className='3xl mb-2 mt-2 font-bold'>제작자</h2>
					{(data.owners as User[]).map(el => (
						<Owner
							key={el.id}
							id={el.id}
							tag={el.tag}
							username={el.username}
						/>
					))}
					<div className='list grid'>
						<Link href={`/bots/${data.id}/report`}>
							<a className='text-red-600 hover:underline'>
								<i className='far fa-flag' />
								신고하기
							</a>
						</Link>
						{data.discord && (
							<a
								rel='noopener noreferrer'
								target='_blank'
								className='text-discord-blurple hover:underline'
								href={`https://discord.gg/${data.discord}`}
							>
								<i className='fab fa-discord' />
								디스코드 서버
							</a>
						)}
						{data.web && (
							<a
								rel='noopener noreferrer'
								target='_blank'
								className='text-blue-500 hover:underline'
								href={data.web}
							>
								<i className='fas fa-globe' />
								웹사이트
							</a>
						)}
						{data.git && (
							<a
								rel='noopener noreferrer'
								target='_blank'
								className='hover:underline'
								href={data.git}
							>
								<i className={`fab fa-${git?.[new URL(data.git).hostname].icon ?? 'git-alt'}`} />
								{git?.[new URL(data.git).hostname].text ?? 'Git'}
							</a>
						)}
					</div>
					<Advertisement />
				</div>
				<div className='markdown-body pt-10 w-full lg:pr-5 lg:w-3/4'>
					<Advertisement />
					<Segment>
						<Markdown text={data.desc}/>
					</Segment>
					<Advertisement />
				</div>
			</div>
		</Container>

		<Footer color='bg-transparent dark:text-discord-black text-white hidden md:block transform rotate-180' theme={theme} setTheme={setTheme} />
	</div>
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx)
	const user = await get.Authorization(parsed?.token)
	const data = await get.bot.load(ctx.query.id) ?? { id: '' }
	return {
		props: {
			data,
			date: SnowflakeUtil.deconstruct(data.id ?? '0').date.toJSON(),
			user: await get.user.load(user || '')
		},
	}
}

export default Bots

interface BotsProps {
	data: Bot
	date: Date
	user: User
	footerControl(val: boolean): void
	theme: Theme
	setTheme(value: Theme): void
}
interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}
