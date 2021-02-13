import dynamic from 'next/dynamic'
import { Bot, User } from '@types'
import { get } from '@utils/Query'
import { parseCookie } from '@utils/Tools'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

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

const VoteBot: NextPage<VoteBotProps> = ({ vote, data }) => {
	const router = useRouter()
	if(!vote) router.push(`/bots/${router.query.id}`)
	return <Container paddingTop className='py-10'>
		<SEO title={data.name} image={
			data.avatar
				? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=1024`
				: `https://cdn.discordapp.com/embed/avatars/${Number(data.tag) % 5}.png?size=1024`
		} />
		<div className='my-auto text-center h-screen'>
			<h1>sadf</h1>
		</div>
	</Container>
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx)
	const data = await get.bot.load(ctx.query.id)
	const user = await get.Authorization(parsed?.token)
	return {
		props: {
			data,
			user: await get.user.load(user || '')
		},
	}
}

interface VoteBotProps {
  vote: boolean
  data: Bot
  user: User
}

interface Context extends NextPageContext {
  query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}

export default VoteBot