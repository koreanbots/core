import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { SnowflakeUtil } from 'discord.js'
import { ParsedUrlQuery } from 'querystring'
import { josa } from 'josa'

import { Bot, User } from '@types'
import * as Query from '@utils/Query'
import { checkUserFlag } from '@utils/Tools'

import NotFound from '../404'

const Container = dynamic(() => import('@components/Container'))
const SEO = dynamic(() => import('@components/SEO'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const Divider = dynamic(() => import('@components/Divider'))
const BotCard = dynamic(() => import('@components/BotCard'))
const Tag = dynamic(() => import('@components/Tag'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Tooltip = dynamic(() => import('@components/Tooltip'))

const Users: NextPage<UserProps> = ({ data }) => {
	if (!data.id) return <NotFound />
	return (
		<Container paddingTop className='py-10'>
			<SEO
				title={data.username}
				description={josa(
					`${(data.bots as Bot[])
						.slice(0, 5)
						.map(el => el.name)
						.join(', ')}#{을} 제작합니다.`
				)}
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
						className='w-full'
					/>
				</div>
				<div className='flex-grow px-5 py-12 w-full text-center lg:w-5/12 lg:text-left'>
					<div>
						<h1 className='mb-2 mt-3 text-4xl font-bold'>{data.username}</h1>
						<span className='ml-0.5 text-gray-400 text-4xl font-semibold'>#{data.tag}</span>
						<br />
						<div className='badges flex'>
							{checkUserFlag(data.flags, 'staff') && (
								<Tooltip text='한국 디스코드봇 리스트 스탭입니다.' direction='left'>
									<div className='pr-5 text-koreanbots-blue text-2xl'>
										<i className='fas fa-hammer' />
									</div>
								</Tooltip>
							)}
							{checkUserFlag(data.flags, 'bughunter') && (
								<Tooltip text='버그를 많이 제보해주신 분입니다.' direction='left'>
									<div className='pr-5 text-green-500 text-2xl'>
										<i className='fas fa-bug' />
									</div>
								</Tooltip>
							)}
						</div>
						<br />
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
					</div>
				</div>
			</div>
			<Divider />
			<h2 className='mt-8 text-3xl font-bold'>제작한 봇</h2>
			<div className='grid gap-x-4 mt-20 2xl:grid-cols-4 md:grid-cols-2'>
				{(data.bots as Bot[]).map((bot: Bot) => (
					<BotCard key={bot.id} bot={bot} />
				))}
			</div>
			<Advertisement />
		</Container>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	const data = await Query.get.user.load(ctx.query.id)
	return { props: { data, date: SnowflakeUtil.deconstruct(data.id ?? '0')?.date?.toJSON() } }
}

interface UserProps {
	data: User
}

interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}

export default Users
