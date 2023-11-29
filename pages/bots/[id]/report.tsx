import { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Field, Form, Formik } from 'formik'

import { Bot, CsrfContext, ResponseProps, User } from '@types'
import { get } from '@utils/Query'
import { makeBotURL, parseCookie } from '@utils/Tools'

import { ParsedUrlQuery } from 'querystring'

import NotFound from 'pages/404'
import { getToken } from '@utils/Csrf'
import { DMCA, TextField } from '@components/ReportTemplate'
import { useState } from 'react'
import Fetch from '@utils/Fetch'
import { ReportSchema } from '@utils/Yup'
import { getJosaPicker } from 'josa'
import { reportCats } from '@utils/Constants'
import { NextSeo } from 'next-seo'

const Container = dynamic(() => import('@components/Container'))
const Message = dynamic(() => import('@components/Message'))
const Login = dynamic(() => import('@components/Login'))

const ReportBot: NextPage<ReportBotProps> = ({ data, user, csrfToken }) => {
	const [reportRes, setReportRes] = useState<ResponseProps<unknown>>(null)
	if (!data?.id) return <NotFound />
	if (!user)
		return (
			<Login>
				<NextSeo title='신고하기' />
			</Login>
		)
	return (
		<Container paddingTop className='py-10'>
			<NextSeo title={`${data.name} 신고하기`} />
			<Link href={makeBotURL(data)} className='text-blue-500 hover:opacity-80'>
				<i className='fas fa-arrow-left mb-3 mt-3' /> <strong>{data.name}</strong>
				{getJosaPicker('로')(data.name)}돌아가기
			</Link>
			{reportRes?.code === 200 ? (
				<Message type='success'>
					<h2 className='text-lg font-semibold'>성공적으로 제출하였습니다!</h2>
					<p>
						더 자세한 설명이 필요할 수 있습니다.{' '}
						<strong>
							반드시{' '}
							<a className='text-blue-600 hover:text-blue-500' href='/discord'>
								공식 디스코드
							</a>
							에 참여해주세요!!
						</strong>
					</p>
				</Message>
			) : (
				<Formik
					onSubmit={async (body) => {
						const res = await Fetch(`/bots/${data.id}/report`, {
							method: 'POST',
							body: JSON.stringify(body),
						})
						setReportRes(res)
					}}
					validationSchema={ReportSchema}
					initialValues={{
						category: null,
						description: '',
						_csrf: csrfToken,
					}}
				>
					{({ errors, touched, values, setFieldValue }) => (
						<Form>
							<div className='mb-5'>
								{reportRes && (
									<div className='my-5'>
										<Message type='error'>
											<h2 className='text-lg font-semibold'>{reportRes.message}</h2>
											<ul className='list-disc'>
												{reportRes.errors?.map((el, n) => <li key={n}>{el}</li>)}
											</ul>
										</Message>
									</div>
								)}
								<h3 className='font-bold'>신고 구분</h3>
								<p className='mb-1 text-sm text-gray-400'>해당되는 항목을 선택해주세요.</p>
								{reportCats.map((el) => (
									<div key={el}>
										<label>
											<Field type='radio' name='category' value={el} className='mr-1.5 py-2' />
											{el}
										</label>
									</div>
								))}
								<div className='mt-1 text-xs font-light text-red-500'>
									{errors.category && touched.category ? (errors.category as string) : null}
								</div>
								{values.category && (
									<>
										{
											{
												[reportCats[2]]: (
													<Message type='info'>
														<h3 className='text-xl font-bold'>
															본인 혹은 다른 사람이 위험에 처해 있나요?
														</h3>
														<p>당신은 소중한 사람입니다.</p>
														<p className='list-item list-inside list-disc'>
															자살예방상담전화 1393 | 청소년전화 1388
														</p>
													</Message>
												),
												[reportCats[5]]: (
													<DMCA
														values={values}
														errors={errors}
														touched={touched}
														setFieldValue={setFieldValue}
													/>
												),
												[reportCats[6]]: (
													<Message type='warning'>
														<h3 className='text-xl font-bold'>
															디스코드 약관을 위반사항을 신고하시려고요?
														</h3>
														<p>
															<a
																className='text-blue-400'
																target='_blank'
																rel='noreferrer'
																href='http://dis.gd/report'
															>
																디스코드 문의
															</a>
															를 통해 직접 디스코드에 신고하실 수도 있습니다.
														</p>
													</Message>
												),
											}[values.category]
										}
										{!['오픈소스 라이선스, 저작권 위반 등 권리 침해'].includes(values.category) && (
											<>
												<h3 className='mt-2 font-bold'>설명</h3>
												<p className='mb-1 text-sm text-gray-400'>최대한 자세하게 기재해주세요.</p>
												<TextField
													values={values}
													errors={errors}
													touched={touched}
													setFieldValue={setFieldValue}
												/>
											</>
										)}
									</>
								)}
							</div>
						</Form>
					)}
				</Formik>
			)}
		</Container>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const data = await get.bot.load(ctx.query.id)
	const user = await get.Authorization(parsed?.token)

	return {
		props: {
			csrfToken: getToken(ctx.req, ctx.res),
			data,
			user: await get.user.load(user || ''),
		},
	}
}

interface ReportBotProps {
	csrfToken: string
	data: Bot
	user: User
}

interface Context extends CsrfContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}

export default ReportBot
