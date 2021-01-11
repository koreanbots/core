import { NextPage, NextPageContext } from 'next'
import { SnowflakeUtil } from 'discord.js'
import { Query } from '../../utils'
import { ParsedUrlQuery } from 'querystring'
import { josa } from 'josa'
import { Bot, User } from '../../types'

import NotFound from '../404'
import Container from '../../components/Container'
import SEO from '../../components/SEO'
import DiscordAvatar from '../../components/DiscordAvatar'
import Divider from '../../components/Divider'
import BotCard from '../../components/BotCard'
import Tag from '../../components/Tag'
import { checkPerm } from '../../utils/Tools'
import Advertisement from '../../components/Advertisement'
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
						avatarHash={data.avatar}
						tag={data.tag}
						className='w-full'
					/>
				</div>
				<div className='flex-grow px-5 py-12 w-full text-center lg:w-5/12 lg:text-left'>
					<div>
						<h1 className='mb-2 mt-3 text-4xl font-bold'>{data.username}</h1>
						<span className='ml-0.5 text-gray-400 text-4xl font-semibold'>#{data.tag}</span>
						<br />
						<div className='badges flex'>
							{checkPerm(data.perm, 'staff') && (
								<div className='pr-5 text-koreanbots-blue text-2xl'>
									<i className='fas fa-hammer' />
								</div>
							)}
							{checkPerm(data.perm, 'bughunter') && (
								<div className='pr-5 text-green-500 text-2xl'>
									<i className='fas fa-bug' />
								</div>
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
			<div className='grid gap-4 mt-20 2xl:grid-cols-4 md:grid-cols-2'>
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
