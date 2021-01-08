import { NextPage, NextPageContext } from 'next'
import { SnowflakeUtil } from 'discord.js'
import { Fetch } from '../../utils'
import { ParsedUrlQuery } from 'querystring'
import NotFound from '../404'
import { Bot, User } from '../../types'
import Container from '../../components/Container'
import SEO from '../../components/SEO'
import DiscordImage from '../../components/DiscordImage'
import Divider from '../../components/Divider'
import BotCard from '../../components/BotCard'
import Tag from '../../components/Tag'
const Users: NextPage<UserProps> = ({ data }) => {
	if (!data.id) return <NotFound />
	return (
		<Container paddingTop className="py-10">
			<SEO
				title={data.username}
				image={
					data.avatar
						? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=1024`
						: `https://cdn.discordapp.com/embed/avatars/${Number(data.tag) % 5}.png?size=1024`
				}
			/>
			<div className="lg:flex">
				<div className="w-full text-center lg:w-1/4">
					<DiscordImage
						userID={data.id}
						avatarHash={data.avatar}
						tag={data.tag}
						className="w-full"
					/>
				</div>
				<div className="flex-grow px-5 py-12 w-full text-center lg:w-5/12 lg:text-left">
					<div>
						<h1 className="mb-2 mt-3 text-4xl font-bold">{data.username}</h1>
						<span className="text-gray-400 text-3xl font-semibold">#{data.tag}</span>
						<br />
						<br />
						{data.github && (
							<Tag
								text={
									<>
										<i className="fab fa-github" /> {data.github}
									</>
								}
								github
								circular
								href={`https://github.com/${data.github}`}
							/>
						)}
					</div>
				</div>
			</div>
			<Divider />
			<h2 className="mt-8 text-3xl font-bold">제작한 봇</h2>
			<div className="grid gap-4 mt-20 lg:grid-cols-4">
				{(data.bots as Bot[]).map((bot: Bot) => (
					<BotCard key={bot.id} bot={bot} />
				))}
			</div>
		</Container>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	const data = await Fetch.user.load(ctx.query.id)
	return { props: { data, date: SnowflakeUtil.deconstruct(data.id ?? '0')?.date?.toJSON() } }
}

interface UserProps {
	data: User
}

interface Context extends NextPageContext {
	query: Query
}

interface Query extends ParsedUrlQuery {
	id: string
}

export default Users
