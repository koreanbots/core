import { NextPage, NextPageContext } from 'next'
import { SnowflakeUtil } from 'discord.js'
import Day from '../../utils/Day'
import { ParsedUrlQuery } from 'querystring'
import { Bot, User } from '../../types'

import Container from '../../components/Container'
import DiscordAvatar from '../../components/DiscordAvatar'
import Divider from '../../components/Divider'
import Tag from '../../components/Tag'
import Owner from '../../components/Owner'
import Segment from '../../components/Segment'
import NotFound from '../404'
import SEO from '../../components/SEO'
import LongButton from '../../components/LongButton'
import { git, Status } from '../../utils/Constants'
import { Query } from '../../utils'
import { formatNumber } from '../../utils/Tools'
import Advertisement from '../../components/Advertisement'
import Link from 'next/link'

const Bots: NextPage<BotsProps> = ({ data, date }) => {
	if (!data || !data.id) return <NotFound />
	return (
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
			<div className='lg:flex'>
				<div className='w-full text-center lg:w-1/4'>
					<DiscordAvatar
						userID={data.id}
						avatarHash={data.avatar}
						tag={data.tag}
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
							{data.trusted ? (
								<span className='text-koreanbots-blue text-3xl'>
									<i className='fas fa-award' />
								</span>
							) : ''}
						</h1>
					</div>
					<p className='dark:text-gray-300 text-gray-800 text-base'>{data.intro}</p>
				</div>
				<div className='w-full lg:w-1/4'>
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
					<LongButton>
						<h4>
							<i className='fas fa-heart text-red-600' /> 하트 추가
						</h4>
						<span className='ml-1 px-2 py-1 text-center text-black dark:text-gray-400 text-sm bg-little-white-hover dark:bg-very-black rounded-lg'>
							{formatNumber(data.votes)}
						</span>
					</LongButton>
				</div>
			</div>
			<Divider className='px-5' />
			<div className='lg:flex lg:flex-row-reverse'>
				<div className='mb-1 w-full lg:w-1/4'>
					<h2 className='3xl mb-2 font-bold'>정보</h2>
					<div className='grid gap-4 grid-cols-2 px-4 py-4 text-black dark:text-gray-400 dark:bg-discord-black bg-little-white'>
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
							data.verified ? 
								<div>
									<i className='fas fa-check text-discord-blurple' /> 디스코드 인증됨
								</div>
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
							avatarHash={el.avatar}
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
						<h1>이 메세지는 테스트 메세지입니다.</h1>
						<h2>아이유 짱</h2>
						<code>yee</code>
						<br />
						<br />
						<pre>멋진 코드블럭</pre>
						<hr />

						<table>
							<thead>
								<tr>
									<th>foo</th>
									<th>bar</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>pizza</td>
									<td>apple</td>
								</tr>
							</tbody>
						</table>
						<ul className='list-disc'>
							<li>first</li>
							<li>second</li>
						</ul>

						<ul className='list-decimal'>
							<li>first</li>
							<li>second</li>
						</ul>
					</Segment>
					<Advertisement />
				</div>
			</div>
		</Container>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	const data = await Query.get.bot.load(ctx.query.id) ?? {}
	return {
		props: {
			data,
			date: SnowflakeUtil.deconstruct(data?.id ?? '0').date.toJSON()
		},
	}
}

export default Bots

interface BotsProps {
	data: Bot
	date: Date
	votes: string
}
interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}
