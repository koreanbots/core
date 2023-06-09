import { useState, useEffect } from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import Tooltip from 'rc-tooltip'

import { SnowflakeUtil } from 'discord.js'
import { ParsedUrlQuery } from 'querystring'
import { Server, Theme, User } from '@types'

import { DiscordEnpoints, DSKR_BOT_ID, KoreanbotsEndPoints } from '@utils/Constants'
import { get, safeImageHost } from '@utils/Query'
import Day from '@utils/Day'
import Fetch from '@utils/Fetch'
import { checkBotFlag, checkServerFlag, checkUserFlag, formatNumber, parseCookie } from '@utils/Tools'
import { getToken } from '@utils/Csrf'

import NotFound from '../../404'

const Container = dynamic(() => import('@components/Container'))
const Image = dynamic(() => import('@components/Image'))
const ServerIcon = dynamic(() => import('@components/ServerIcon'))
const Divider = dynamic(() => import('@components/Divider'))
const Tag = dynamic(() => import('@components/Tag'))
const Owner = dynamic(() => import('@components/Owner'))
const Segment = dynamic(() => import('@components/Segment'))
const LongButton = dynamic(() => import('@components/LongButton'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Markdown = dynamic(() => import ('@components/Markdown'))
const Message = dynamic(() => import('@components/Message'))
const Modal = dynamic(() => import('@components/Modal'))

const Servers: NextPage<ServersProps> = ({ data, desc, date, user, theme }) => {
	const [ emojisModal, setEmojisModal ] = useState(false)
	const [ ownersModal, setOwnersModal ] = useState(false)
	const [ owners, setOwners ] = useState<User[]>(null)
	const bg = checkBotFlag(data?.flags, 'trusted') && data?.banner
	const router = useRouter()
	useEffect(() => {
		if(data) Fetch<User[]>(`/servers/${data.id}/owners`).then(async res => {
			if(res?.code === 200) setOwners(res.data)
		})
	}, [ data ])
	if (!data?.id) return <NotFound />
	return <div style={bg ? { background: `linear-gradient(to right, rgba(34, 36, 38, 0.68), rgba(34, 36, 38, 0.68)), url("${data.bg}") center top / cover no-repeat fixed` } : {}}>
		<Container paddingTop className='py-10'>
			<NextSeo
				title={data.name}
				description={data.intro}
				twitter={{
					cardType: 'summary_large_image'
				}}
				openGraph={{
					images: [
						{
							url: KoreanbotsEndPoints.OG.server(data.id, data.name, data.intro, data.category, [formatNumber(data.votes), formatNumber(data.members)]),
							width: 2048,
							height: 1170,
							alt: 'Server Preview Image'
						}
					]
				}}
			/>
			{
				data.state === 'blocked' ? <div className='pb-40'>
					<Message type='error'>
						<h2 className='text-lg font-extrabold'>해당 서버는 관리자에 의해 삭제되었습니다.</h2>
					</Message>
				</div>
					: <>
						<div className='w-full pb-2'>
							{
								data.state === 'unreachable' ? <Message type='error'>
									<h2 className='text-lg font-extrabold'>서버 정보를 갱신할 수 없습니다.</h2>
									<p>서버에서 봇이 추방되었거나, 봇이 오프라인이여서 서버 정보를 갱신할 수 없습니다.</p>
									{
										owners?.find(el => el.id === user?.id) && <>
											<h3 className='text-md font-bold pt-2'>서버 관리자시군요!</h3>
											<p>봇을 서버에서 추방하셨다면 <a className='text-blue-600 hover:text-blue-500 cursor-pointer' href={`${DiscordEnpoints.InviteApplication(DSKR_BOT_ID, {}, 'bot', null, data.id)}&disable_guild_select=true`}>이곳</a>을 눌러 봇을 다시 초대해주세요!</p>
										</>
									}
								</Message> :
									data.state === 'reported' ?
										<Message type='error'>
											<h2 className='text-lg font-extrabold'>해당 서버는 신고가 접수되어, 관리자에 의해 잠금 상태입니다.</h2>
											<p>해당 서버를 주의해주세요.</p>
											<p>서버 관리자 분은 <Link href='/guidelines'><a className='text-blue-500 hover:text-blue-400'>가이드라인</a></Link>에 대한 위반사항을 확인해주시고 <Link href='/discord'><a className='text-blue-500 hover:text-blue-400'>디스코드 서버</a></Link>로 문의해주세요.</p>
										</Message> : ''
							}
						</div>
						<div className='lg:flex w-full'>
							<div className='w-full text-center lg:w-2/12'>
								<ServerIcon
									id={data.id}
									size={256}
									className='w-full rounded-full'
								/>
							</div>
							<div className='flex-grow px-5 py-12 w-full text-center lg:w-5/12 lg:text-left'>
								<h1 className='mb-2 mt-3 text-4xl font-bold' style={bg ? { color: 'white' } : {}}>
									{data.name}{' '}
									{checkServerFlag(data.flags, 'trusted') ? (
										<Tooltip placement='bottom' overlay='해당 서버는 한국 디스코드 리스트에서 엄격한 기준을 통과한 서버 입니다!'>
											<span className='text-koreanbots-blue text-3xl'>
												<i className='fas fa-award' />
											</span>
										</Tooltip>
									) : ''}
								</h1>
								<p className={`${bg ? 'text-gray-300' : 'dark:text-gray-300 text-gray-800'} text-base`}>{data.intro}</p>
							</div>
							<div className='w-full lg:w-1/4'>
								{
									['ok', 'unreachable'].includes(data.state) && <LongButton
										newTab
										href={`/servers/${router.query.id}/join`}
									>
										<h4 className='whitespace-nowrap'>
											<i className='fas fa-user-plus text-discord-blurple' /> 참가하기
										</h4>
									</LongButton>
								}
								<Link href={`/servers/${router.query.id}/vote`}>
									<LongButton>
										<h4>
											<i className='fas fa-heart text-red-600' /> 하트 추가
										</h4>
										<span className='ml-1 px-2 text-center text-black dark:text-gray-400 text-sm bg-little-white-hover dark:bg-very-black rounded-lg'>
											{formatNumber(data.votes)}
										</span>
									</LongButton>
								</Link>
								{
									(owners?.find(el => el.id === user?.id) || checkUserFlag(user?.flags, 'staff')) && <>
										<LongButton href={`/servers/${data.id}/edit`}>
											<h4>
												<i className='fas fa-cogs' /> 관리하기
											</h4>
										</LongButton>
										{/* <LongButton onClick={async() => {
											const res = await Fetch(`/servers/${data.id}/stats`, { method: 'PATCH'} )
											if(res.code !== 200) return alert(res.message)
											else window.location.reload()
										}}>
											<h4>
												<i className='fas fa-sync' /> 정보 갱신하기
											</h4>
										</LongButton> */}
									</>
								}
							</div>
						</div>
						<Divider className='px-5' />
						<div className='hidden lg:block'>
							<Advertisement />
						</div>
						<div className='lg:flex lg:flex-row-reverse' style={bg ? { color: 'white' } : {}}>
							<div className='mb-1 w-full lg:w-1/4'>
								<h2 className='3xl mb-2 font-bold'>정보</h2>
								<div className='grid gap-4 grid-cols-2 px-4 py-4 text-black dark:text-gray-400 dark:bg-discord-black bg-little-white rounded-sm'>
									<div>
										<i className='fas fa-users' /> 멤버 수
									</div>
									<div>{data.members || 'N/A'}</div>
									<div>
										<i className='far fa-gem' /> 부스트 티어
									</div>
									<div>{typeof data.boostTier === 'number' ? `${data.boostTier}레벨` : 'N/A'}</div>
									<div>
										<i className='fas fa-calendar-day' /> 서버 생성일
									</div>
									<div>{Day(date).fromNow(false)}</div>
									{
										checkServerFlag(data.flags, 'discord_partnered') ?
											<Tooltip overlay='해당 서버는 디스코드 파트너 입니다.'>
												<div className='col-span-2'>
													<i className='fas fa-infinity text-discord-blurple' /> 디스코드 파트너
												</div>
											</Tooltip>
											: ''
									}
									{
										checkServerFlag(data.flags, 'verified') ?
											<Tooltip overlay='해당 서버는 디스코드에서 인증된 서버입니다.'>
												<div className='col-span-2'>
													<i className='fas fa-check text-discord-blurple' /> 디스코드 인증됨
												</div>
											</Tooltip>
											: ''
									}
								</div>
								<h2 className='3xl mb-2 mt-2 font-bold'>카테고리</h2>
								<div className='flex flex-wrap'>
									{data.category.map(el => (
										<Tag key={el} text={el} href={`/servers/categories/${el}`} />
									))}
								</div>
								{ 
									data.emojis.length !== 0 && <>
										<h2 className='3xl mb-2 mt-2 font-bold'>이모지</h2>
										<div className='flex flex-wrap'>
											{
												data.emojis.slice(0, 5).map(el => <Image src={el.url} key={el.name} className='h-8 m-1' />)
											}
											{
												data.emojis.length > 5 && <Tag className='cursor-pointer' onClick={() => setEmojisModal(true)} text={`+${data.emojis.length - 5}개`} />
											}
										</div>
										<Modal header='이모지 전체보기' closeIcon isOpen={emojisModal} onClose={() => setEmojisModal(false)}
											full dark={theme === 'dark'}>
											<strong>{data.emojis.length}</strong>개의 이모지가 있습니다.
											<div className='flex flex-wrap'>
												{
													data.emojis.map(el => <Tooltip zIndex={1000} key={el.name} placement='top' overlay={`:${el.name}:`} mouseLeaveDelay={0}>
														<div>
															<Image src={el.url} className='h-8 m-1' />
														</div>
													</Tooltip>)
												}
											</div>
										</Modal>
									</>
								}
								<h2 className='3xl mb-2 mt-2 font-bold'>소유자</h2>
								{
									data.owner && <Owner
										key={data.owner.id}
										id={data.owner.id}
										tag={data.owner.tag}
										globalName={data.owner.globalName}
										username={data.owner.username}
									/>
								}
								<LongButton onClick={() => setOwnersModal(true)}>관리자 전체보기</LongButton>
								<Modal header='관리자 전체보기' closeIcon isOpen={ownersModal} onClose={() => setOwnersModal(false)}
									full dark={theme === 'dark'}>
									<div className='grid gap-x-1 grid-rows-1 md:grid-cols-2'>
										{owners ? owners.map(el => (
											<Owner
												key={el.id}
												id={el.id}
												tag={el.tag}
												globalName={el.globalName}
												username={el.username}
												crown={el.id === data.owner?.id}
											/>
										)) : <strong>불러오는 중...</strong>}
									</div>
								</Modal>
								<div className='list grid'>
									<Link href={`/servers/${router.query.id}/report`}>
										<a className='text-red-600 hover:underline cursor-pointer' aria-hidden='true'>
											<i className='far fa-flag' />신고하기
										</a>
									</Link>
										
								</div>
								<Advertisement size='tall' />
							</div>
							<div className='w-full lg:pr-5 lg:w-3/4'>
								<Segment className='my-4'>
									<Markdown text={desc}/>
								</Segment>
								<Advertisement />
							</div>
						</div>
					</>
			}
		</Container>
	</div>
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const data = await get.server.load(ctx.query.id)
	if(!data) return {
		props: {
			data
		}
	}
	const desc = safeImageHost(data.desc)
	const user = await get.Authorization(parsed?.token)
	if((checkServerFlag(data.flags, 'trusted') || checkServerFlag(data.flags, 'partnered')) && data.vanity && data.vanity !== ctx.query.id) {
		return {
			redirect: {
				destination: `/servers/${data.vanity}`,
				permanent: true
			},
			props: {}
		}
	}
	return {
		props: {
			data,
			desc,
			date: Number(SnowflakeUtil.deconstruct(data.id ?? '0').timestamp),
			user: await get.user.load(user || ''),
			csrfToken: getToken(ctx.req, ctx.res)
		},
	}
}

export default Servers



interface ServersProps {
	data: Server
	desc: string
	date: Date
	user: User
	theme: Theme
	csrfToken: string
}
interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}
