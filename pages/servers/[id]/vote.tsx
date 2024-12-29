import { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { CsrfContext, ResponseProps, Server, Theme, User } from '@types'
import { get } from '@utils/Query'
import { parseCookie, checkServerFlag, makeServerURL } from '@utils/Tools'

import { ParsedUrlQuery } from 'querystring'

import NotFound from 'pages/404'
import { getToken } from '@utils/Csrf'
import Captcha from '@components/Captcha'
import { useState } from 'react'
import Fetch from '@utils/Fetch'
import Day from '@utils/Day'
import { getJosaPicker } from 'josa'
import { KoreanbotsEndPoints } from '@utils/Constants'
import { NextSeo } from 'next-seo'

const Container = dynamic(() => import('@components/Container'))
const ServerIcon = dynamic(() => import('@components/ServerIcon'))
const Button = dynamic(() => import('@components/Button'))
const Tag = dynamic(() => import('@components/Tag'))
const Segment = dynamic(() => import('@components/Segment'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Login = dynamic(() => import('@components/Login'))
const Message = dynamic(() => import('@components/Message'))

const VoteServer: NextPage<VoteServerProps> = ({ data, user, theme, csrfToken }) => {
	const [votingStatus, setVotingStatus] = useState(0)
	const [result, setResult] = useState<ResponseProps<{ retryAfter?: number }>>(null)
	const router = useRouter()
	if (!data?.id) return <NotFound />
	if (!user)
		return (
			<Login>
				<NextSeo
					title={data.name}
					description={`한국 디스코드 리스트에서 ${data.name}에 투표하세요.`}
					openGraph={{
						images: [
							{
								url: KoreanbotsEndPoints.CDN.icon(data.id, { format: 'png', size: 256 }),
								width: 256,
								height: 256,
								alt: 'Server Icon',
							},
						],
					}}
				/>
			</Login>
		)

	if (
		(checkServerFlag(data.flags, 'trusted') || checkServerFlag(data.flags, 'partnered')) &&
		data.vanity &&
		data.vanity !== router.query.id
	)
		router.push(`/servers/${data.vanity}/vote?csrfToken=${csrfToken}`)
	return (
		<Container paddingTop className='py-10'>
			<NextSeo
				title={data.name}
				description={`한국 디스코드 리스트에서 ${data.name}에 투표하세요.`}
				openGraph={{
					images: [
						{
							url: KoreanbotsEndPoints.CDN.icon(data.id, { format: 'png', size: 256 }),
							width: 256,
							height: 256,
							alt: 'Server Avatar',
						},
					],
				}}
			/>
			{data.state === 'blocked' ? (
				<div className='pb-40'>
					<Message type='error'>
						<h2 className='text-lg font-extrabold'>해당 서버는 관리자에 의해 삭제되었습니다.</h2>
					</Message>
				</div>
			) : (
				<>
					<Advertisement />
					<Link href={makeServerURL(data)} className='text-blue-500 hover:opacity-80'>
						<i className='fas fa-arrow-left mb-3 mt-3' /> <strong>{data.name}</strong>
						{getJosaPicker('로')(data.name)}돌아가기
					</Link>
					<Segment className='mb-16 py-8'>
						<div className='text-center'>
							<ServerIcon id={data.id} className='mx-auto mb-4 h-52 w-52 rounded-full bg-white' hash={data.icon} />
							<Tag
								text={
									<span>
										<i className='fas fa-heart text-red-600' /> {data.votes}
									</span>
								}
								dark
							/>
							<h1 className='mt-3 text-3xl font-bold'>{data.name}</h1>
							<h4 className='text-md mt-1'>12시간마다 다시 투표하실 수 있습니다.</h4>
							<div className='mt-2 inline-block'>
								{votingStatus === 0 ? (
									<Button onClick={() => setVotingStatus(1)}>
										<>
											<i className='far fa-heart text-red-600' /> 하트 추가
										</>
									</Button>
								) : votingStatus === 1 ? (
									<Captcha
										dark={theme === 'dark'}
										onVerify={async (key) => {
											const res = await Fetch<{ retryAfter: number } | unknown>(
												`/servers/${data.id}/vote`,
												{
													method: 'POST',
													body: JSON.stringify({ _csrf: csrfToken, _captcha: key }),
												}
											)
											setResult(res)
											setVotingStatus(2)
										}}
									/>
								) : result.code === 200 ? (
									<h2 className='text-2xl font-bold'>해당 서버에 투표했습니다!</h2>
								) : result.code === 429 ? (
									<>
										<h2 className='text-2xl font-bold'>이미 해당 서버에 투표하였습니다.</h2>
										<h4 className='text-md mt-1'>
											{Day(+new Date() + result.data?.retryAfter).fromNow()} 다시 투표하실 수
											있습니다.
										</h4>
									</>
								) : (
									<p>{result.message}</p>
								)}
							</div>
						</div>
					</Segment>
					<Advertisement />
				</>
			)}
		</Container>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const data = await get.server.load(ctx.query.id)
	const user = await get.Authorization(parsed?.token)

	return {
		props: {
			csrfToken: getToken(ctx.req, ctx.res),
			data,
			user: await get.user.load(user || ''),
		},
	}
}

interface VoteServerProps {
	csrfToken: string
	vote: boolean
	data: Server
	user: User
	theme: Theme
}

interface Context extends CsrfContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}

export default VoteServer
