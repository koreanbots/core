import { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Bot, CsrfContext, User } from '@types'
import { get } from '@utils/Query'
import { makeBotURL, parseCookie, checkBotFlag } from '@utils/Tools'

import { ParsedUrlQuery } from 'querystring'

import NotFound from 'pages/404'
import { getToken } from '@utils/Csrf'


const Container = dynamic(() => import('@components/Container'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const Button = dynamic(() => import('@components/Button'))
const Tag = dynamic(() => import('@components/Tag'))
const Segment = dynamic(() => import('@components/Segment'))
const SEO = dynamic(() => import('@components/SEO'))
const Advertisement = dynamic(() => import('@components/Advertisement'))

const VoteBot: NextPage<VoteBotProps> = ({ data, csrfToken }) => {
	console.log(csrfToken)
	const router = useRouter()
	if(!data?.id) return <NotFound />
	if((checkBotFlag(data.flags, 'trusted') || checkBotFlag(data.flags, 'partnered')) && data.vanity && data.vanity !== router.query.id) router.push(`/bots/${data.vanity}`)
	return <Container paddingTop className='py-10'>
		<SEO title={data.name} description={`한국 디스코드봇 리스트에서 ${data.name}에 투표하세요`} image={
			data.avatar
				? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=1024`
				: `https://cdn.discordapp.com/embed/avatars/${Number(data.tag) % 5}.png?size=1024`
		} />
		<Advertisement />
		<Link href={makeBotURL(data)}>
			<a className='text-blue-500 hover:opacity-80'><i className='fas fa-arrow-left mt-3 mb-3' /> <strong>{data.name}</strong>으로 돌아가기</a>
		</Link>
		<Segment className='mb-10 py-8'>
			<div className='text-center'>
				<DiscordAvatar userID={data.id} className='mx-auto w-52 h-52 bg-white mb-4' />
				<Tag text={<span><i className='fas fa-heart text-red-600' /> {data.votes}</span>} dark />
				<h1 className='text-3xl font-bold mt-3'>{data.name}</h1>
				<h4 className='text-md mt-1'>12시간 뒤에 다시 투표하실 수 있습니다.</h4>
				<Button>
					<><i className='far fa-heart text-red-600'/> 하트 추가</>
				</Button>
			</div>
		</Segment>
		<Advertisement />
	</Container>
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const data = await get.bot.load(ctx.query.id)
	const user = await get.Authorization(parsed?.token)
	
	return {
		props: {
			csrfToken: getToken(ctx.req, ctx.res),
			data,
			user: await get.user.load(user || '')
		},
	}
}

interface VoteBotProps {
	csrfToken: string
  vote: boolean
  data: Bot
  user: User
}

interface Context extends CsrfContext {
  query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}

export default VoteBot