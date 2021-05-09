import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import Tooltip from 'rc-tooltip'

import { SnowflakeUtil } from 'discord.js'
import { ParsedUrlQuery } from 'querystring'
import { Bot, ResponseProps, Theme, User } from '@types'

import { git, KoreanbotsEndPoints, reportCats, Status } from '@utils/Constants'
import { get } from '@utils/Query'
import Day from '@utils/Day'
import { ReportSchema } from '@utils/Yup'
import Fetch from '@utils/Fetch'
import { checkBotFlag, checkUserFlag, formatNumber, parseCookie } from '@utils/Tools'
import { getToken } from '@utils/Csrf'

import NotFound from '../../404'

const Container = dynamic(() => import('@components/Container'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const Divider = dynamic(() => import('@components/Divider'))
const Tag = dynamic(() => import('@components/Tag'))
const Owner = dynamic(() => import('@components/Owner'))
const Segment = dynamic(() => import('@components/Segment'))
const SEO = dynamic(() => import('@components/SEO'))
const LongButton = dynamic(() => import('@components/LongButton'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Markdown = dynamic(() => import ('@components/Markdown'))
const Message = dynamic(() => import('@components/Message'))
const Button = dynamic(() => import('@components/Button'))
const TextArea = dynamic(() => import('@components/Form/TextArea'))
const Modal = dynamic(() => import('@components/Modal'))
const NSFW = dynamic(() => import('@components/NSFW'))
const Login = dynamic(() => import('@components/Login'))

const Bots: NextPage<BotsProps> = ({ data, desc, date, user, theme, csrfToken }) => {
	const bg = checkBotFlag(data?.flags, 'trusted') && data?.banner
	const router = useRouter()
	const [ nsfw, setNSFW ] = useState<boolean>()
	const [ reportModal, setReportModal ] = useState(false)
	const [ reportRes, setReportRes ] = useState<ResponseProps<unknown>>(null)
	useEffect(() => {
		setNSFW(localStorage.nsfw)
	}, [])
	if (!data?.id) return <NotFound />
	return <div style={bg ? { background: `linear-gradient(to right, rgba(34, 36, 38, 0.68), rgba(34, 36, 38, 0.68)), url("${data.bg}") center top / cover no-repeat fixed` } : {}}>
		<Container paddingTop className='py-10'>
			<SEO
				title={data.name}
				description={data.intro}
				image={KoreanbotsEndPoints.CDN.avatar(data.id, { format: 'png', size: 256 })}
			/>
			{
				data.state === 'blocked' ? <div className='pb-40'>
					<Message type='error'>
						<h2 className='text-lg font-black'>해당 봇은 관리자에 의해 삭제되었습니다.</h2>
					</Message>
				</div>
					: data.category.includes('NSFW') && !nsfw ? <NSFW onClick={() => setNSFW(true)} onDisableClick={() => localStorage.nsfw = true} /> 
						: <>
							<div className='w-full pb-2'>
								{
									data.state === 'private' ? <Message type='info'>
										<h2 className='text-lg font-black'>해당 봇은 특수목적 봇이므로 초대하실 수 없습니다.</h2>
										<p>해당 봇은 공개 사용이 목적이 아닌 특수목적봇입니다. 따라서 따로 초대하실 수 없습니다.</p>
									</Message> :
										data.state === 'reported' ?
											<Message type='error'>
												<h2 className='text-lg font-black'>해당 봇은 신고가 접수되어, 관리자에 의해 잠금 상태입니다.</h2>
												<p>해당 봇 사용에 주의해주세요.</p>
												<p>봇 소유자분은 <Link href='/guidelines'><a className='text-blue-500 hover:text-blue-400'>가이드라인</a></Link>에 대한 위반사항을 확인해주시고 <Link href='/discord'><a className='text-blue-500 hover:text-blue-400'>디스코드 서버</a></Link>로 문의해주세요.</p>
											</Message> : ''
								}
							</div>
							<div className='lg:flex w-full'>
								<div className='w-full text-center lg:w-1/4'>
									<DiscordAvatar
										userID={data.id}
										className={`w-full ${router.query.id === 'iu' ? 'cursor-heart' : ''}`}
									/>
								</div>
								<div className='flex-grow px-5 py-12 w-full text-center lg:w-5/12 lg:text-left'>
									<Tag
										circular
										text={
											<>
												<i className={`fas fa-circle text-${Status[data.status]?.color}`} />{' '}
												{Status[data.status]?.text}
											</>
										}
									/>
									<h1 className='mb-2 mt-3 text-4xl font-bold' style={bg ? { color: 'white' } : {}}>
										{data.name}{' '}
										{checkBotFlag(data.flags, 'trusted') ? (
											<Tooltip placement='bottom' overlay='해당 봇은 한국 디스코드봇 리스트에서 엄격한 기준을 통과한 봇입니다!'>

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
										data.state === 'ok' && <LongButton
											newTab
											href={
												data.url ||
					`https://discordapp.com/oauth2/authorize?client_id=${data.id}&scope=bot&permissions=0`
											}
										>
											<h4 className='whitespace-nowrap'>
												<i className='fas fa-user-plus text-discord-blurple' /> 초대하기
											</h4>
										</LongButton>
									}
									<Link href={{ pathname: `/bots/${router.query.id}/vote`, query: { csrfToken } }}>
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
										((data.owners as User[]).find(el => el.id === user?.id) || checkUserFlag(user?.flags, 'staff')) && <LongButton href={`/manage/${data.id}`}>
											<h4>
												<i className='fas fa-cogs' /> 관리하기
											</h4>
										</LongButton>
									}
								</div>
							</div>
							<Divider className='px-5' />
							<div className='lg:flex lg:flex-row-reverse' style={bg ? { color: 'white' } : {}}>
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
										<div>{data.servers || 'N/A'}</div>
										<div>
											<i className='fas fa-calendar-day' /> 봇 생성일
										</div>
										<div>{Day(date).fromNow(false)}</div>
										{
											checkBotFlag(data.flags, 'trusted') ?
												<Tooltip overlay='해당 봇은 디스코드측에서 인증된 봇입니다.'>
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
										<a className='text-red-600 hover:underline cursor-pointer' onClick={() => {
											if(!user) return <Login />
											else setReportModal(true)
										}} aria-hidden='true'>
											<i className='far fa-flag' />
						신고하기
										</a>
										<Modal header={`${data.name}#${data.tag} 신고하기`} closeIcon isOpen={reportModal} onClose={() => {
											setReportModal(false)
											setReportRes(null)
										}} full dark={theme === 'dark'}>
											{
												reportRes?.code === 200 ? <Message type='success'>
													<h2 className='text-lg font-semibold'>성공적으로 신고하였습니다!</h2>
													<p>더 자세한 설명이 필요할 수 있습니다! <a className='text-blue-600 hover:text-blue-500' href='/discord'>공식 디스코드</a>에 참여해주세요</p>
												</Message> : <Formik onSubmit={async (body) => {
													const res = await Fetch(`/bots/${data.id}/report`, { method: 'POST', body: JSON.stringify(body) })
													setReportRes(res)
												}} validationSchema={ReportSchema} initialValues={{
													category: null,
													description: '',
													_csrf: csrfToken
												}}>
													{
														({ errors, touched, values, setFieldValue }) => (
															<Form>
																<div className='mb-5'>
																	{
																		reportRes && <div className='my-5'>
																			<Message type='error'>
																				<h2 className='text-lg font-semibold'>{reportRes.message}</h2>
																				<ul className='list-disc'>
																					{reportRes.errors?.map((el, n) => <li key={n}>{el}</li>)}
																				</ul>
																			</Message>
																		</div>
																	}
																	<h3 className='font-bold'>신고 구분</h3>
																	<p className='text-gray-400 text-sm mb-1'>해당되는 항목을 선택해주세요.</p>
																	{
																		reportCats.map(el => 
																			<div key={el}>
																				<label>
																					<Field type='radio' name='category' value={el} className='mr-1.5 py-2' />
																					{el}
																				</label>
																			</div>
																		)
																	}
																	<div className='mt-1 text-red-500 text-xs font-light'>{errors.category && touched.category ? errors.category : null}</div>
																	<h3 className='font-bold mt-2'>설명</h3>
																	<p className='text-gray-400 text-sm mb-1'>신고하시는 내용을 자세하게 설명해주세요.</p>
																	<TextArea name='description' placeholder='최대한 자세하게 설명해주세요!' theme={theme === 'dark' ? 'dark' : 'light'} value={values.description} setValue={(value) => setFieldValue('description', value)} />
																	<div className='mt-1 text-red-500 text-xs font-light'>{errors.description && touched.description ? errors.description : null}</div>
																</div>
																<div className='text-right'>
																	<Button className='bg-gray-500 hover:opacity-90 text-white' onClick={()=> setReportModal(false)}>취소</Button>
																	<Button type='submit' className='bg-red-500 hover:opacity-90 text-white'>제출</Button>
																</div>
															</Form>
														)
													}
												</Formik>
											}
										</Modal>
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
												<i className={`fab fa-${git[new URL(data.git).hostname]?.icon ?? 'git-alt'}`} />
												{git[new URL(data.git).hostname]?.text ?? 'Git'}
											</a>
										)}
									</div>
									<Advertisement size='tall' />
								</div>
								<div className='w-full lg:pr-5 lg:w-3/4'>
									<div className='hidden lg:block'>
										<Advertisement />
									</div>
									{
										checkBotFlag(data.flags, 'hackerthon') ? <Segment className='mt-10'>
											<h1 className='text-3xl font-semibold'>
												<i className='fas fa-trophy mr-4 my-2 text-yellow-300' /> 해당 봇은 한국 디스코드봇 리스트 해커톤 수상작품입니다!
											</h1>
											<p>해당 봇은 한국 디스코드봇 리스트 주최로 진행되었던 "한국 디스코드봇 리스트 제1회 해커톤"에서 우수한 성적을 거둔 봇입니다.</p>
											<p>자세한 내용은 <a className='text-blue-500 hover:text-blue-400' href='https://blog.koreanbots.dev/first-hackathon-results/'>해당 글</a>을 확인해주세요.</p>
										</Segment> : ''
									}
									<div className='markdown-body pt-4 w-full'>
										<Segment className='my-4'>
											<Markdown text={desc}/>
										</Segment>
										<Advertisement />
									</div>
								</div>
							</div>
						</>
			}
		</Container>
	</div>
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const data = await get.bot.load(ctx.query.id)
	if(!data) return {
		props: {
			data
		}
	}
	const desc = await get.botDescSafe(data.id)
	const user = await get.Authorization(parsed?.token)
	if((checkBotFlag(data.flags, 'trusted') || checkBotFlag(data.flags, 'partnered')) && data.vanity && data.vanity !== ctx.query.id) {
		ctx.res.statusCode = 301
		ctx.res.setHeader('Location', `/bots/${data.vanity}`)
		return {
			props: {}
		}
	}
	return {
		props: {
			data,
			desc,
			date: SnowflakeUtil.deconstruct(data.id ?? '0').date.toJSON(),
			user: await get.user.load(user || ''),
			csrfToken: getToken(ctx.req, ctx.res)
		},
	}
}

export default Bots

interface BotsProps {
	data: Bot
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
