import { NextPage, NextPageContext } from 'next'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { SnowflakeUtil } from 'discord.js'
import { ParsedUrlQuery } from 'querystring'
import { josa } from 'josa'
import { Field, Form, Formik } from 'formik'

import { Bot, User, ResponseProps, Theme } from '@types'
import { get } from '@utils/Query'
import { checkUserFlag, parseCookie } from '@utils/Tools'
import { getToken } from '@utils/Csrf'
import Fetch from '@utils/Fetch'
import { ReportSchema } from '@utils/Yup'

import NotFound from '../404'
import { KoreanbotsEndPoints, reportCats } from '@utils/Constants'

const Container = dynamic(() => import('@components/Container'))
const SEO = dynamic(() => import('@components/SEO'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const Divider = dynamic(() => import('@components/Divider'))
const BotCard = dynamic(() => import('@components/BotCard'))
const ResponsiveGrid = dynamic(() => import('@components/ResponsiveGrid'))
const Tag = dynamic(() => import('@components/Tag'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Tooltip = dynamic(() => import('@components/Tooltip'))
const Message = dynamic(() => import('@components/Message'))
const Modal = dynamic(() => import('@components/Modal'))
const Button = dynamic(() => import('@components/Button'))
const TextArea = dynamic(() => import('@components/Form/TextArea'))
const Login = dynamic(() => import('@components/Login'))

const Users: NextPage<UserProps> = ({ user, data, csrfToken, theme }) => {
	const [ reportModal, setReportModal ] = useState(false)
	const [ reportRes, setReportRes ] = useState<ResponseProps<null>>(null)
	if (!data?.id) return <NotFound />
	return (
		<Container paddingTop className='py-10'>
			<SEO
				title={data.username}
				description={data.bots.length === 0 ? `${data.username}님의 프로필입니다.` : josa(
					`${(data.bots as Bot[])
						.slice(0, 5)
						.map(el => el.name)
						.join(', ')}#{을} 제작합니다.`
				)}
				image={KoreanbotsEndPoints.CDN.avatar(data.id, { format: 'png', size: 256 })}
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
						<div className='lg:flex mt-3 mb-1 '>
							<h1 className='text-4xl font-bold'>{data.username}</h1>
							<span className='ml-0.5 text-gray-400 text-3xl font-semibold mt-1'>#{data.tag}</span>
						</div>
						<div className='badges flex mb-2 justify-center lg:justify-start'>
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
						<div className='list-none mt-2'>
							<a className='text-red-600 hover:underline cursor-pointer' onClick={() => {
								if(!user) return <Login />
								else setReportModal(true)
							}} aria-hidden='true'>
								<i className='far fa-flag' />
								신고하기
							</a>
						</div>
						<Modal header={user.id === data.id ? '자기 자신은 신고할 수 없습니다.' : `${data.username}#${data.tag} 신고하기`} closeIcon isOpen={reportModal} onClose={() => {
							setReportModal(false)
							setReportRes(null)
						}} full dark={theme === 'dark'}>
							{
								user.id === data.id ? <div className='text-center py-20'>
									<h2 className='text-xl font-semibold'>
										" 현명한 조언을 해주는 것은 자기 이외에는 없다. "
									</h2>
								</div> :
									reportRes?.code === 200 ? <Message type='success'>
										<h2 className='text-lg font-semibold'>성공적으로 신고하였습니다!</h2>
										<p>더 자세한 설명이 필요할 수 있습니다! <a className='text-blue-600 hover:text-blue-500' href='/discord'>공식 디스코드</a>에 참여해주세요</p>
									</Message> : <Formik onSubmit={async (body) => {
										const res = await Fetch<null>(`/users/${data.id}/report`, { method: 'POST', body: JSON.stringify(body) })
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
					</div>
				</div>
			</div>
			<Divider />
			<h2 className='mt-8 text-3xl font-bold'>제작한 봇</h2>
			
			{data.bots.length === 0 ? <h2 className='text-xl'>소유한 봇이 없습니다.</h2> : 
				<ResponsiveGrid>
					{
						(data.bots as Bot[]).map((bot: Bot) => (
							<BotCard key={bot.id} bot={bot} />
						))
					}
				</ResponsiveGrid>
			}
			
			<Advertisement />
		</Container>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	
	const user = await get.Authorization(parsed?.token) || ''
	const data = await get.user.load(ctx.query.id)
	return { props: { user: await get.user.load(user) || {}, data, date: SnowflakeUtil.deconstruct(data?.id ?? '0')?.date?.toJSON(), csrfToken: getToken(ctx.req, ctx.res) } }
}

interface UserProps {
	user: User
	data: User
	csrfToken: string
	theme: Theme
}

interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}

export default Users
