import { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Field, Form, Formik } from 'formik'

import { CsrfContext, ResponseProps, User } from '@types'
import { get } from '@utils/Query'
import { makeUserURL, parseCookie } from '@utils/Tools'

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

const ReportUser: NextPage<ReportUserProps> = ({ data, user, csrfToken }) => {
	const [ reportRes, setReportRes ] = useState<ResponseProps<unknown>>(null)
	if(!data?.id) return <NotFound />
	if(!user) return <Login>
		<NextSeo title='신고하기' />
	</Login>
	
	return <Container paddingTop className='py-10'>
		<NextSeo title={`${data.username} 신고하기`} />
		<Link href={makeUserURL(data)}>
			<a className='text-blue-500 hover:opacity-80'><i className='fas fa-arrow-left mt-3 mb-3' /> <strong>{data.username}</strong>{getJosaPicker('로')(data.username)} 돌아가기</a>
		</Link>
		{
			reportRes?.code === 200 ? <Message type='success'>
				<h2 className='text-lg font-semibold'>성공적으로 제출하였습니다!</h2>
				<p>더 자세한 설명이 필요할 수 있습니다. <strong>반드시 <a className='text-blue-600 hover:text-blue-500' href='/discord'>공식 디스코드</a>에 참여해주세요!!</strong></p>
			</Message> : <Formik onSubmit={async (body) => {
				const res = await Fetch(`/users/${data.id}/report`, { method: 'POST', body: JSON.stringify(body) })
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
								{
									values.category && <>
										{
											values.category === '오픈소스 라이선스, 저작권 위반 등 권리 침해' ? <DMCA values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} /> :
												values.category === '괴롭힘, 모욕, 명예훼손' ? <>
													<Message type='info'>
														<h3 className='font-bold text-xl'>본인 혹은 다른 사람이 위험에 처해 있나요?</h3>
														<p>당신은 소중한 사람입니다.</p>
														<p className='list-disc list-item list-inside'>자살예방상담전화 1393 | 청소년전화 1388</p>
													</Message>
												</> : ''
										}
										{
											!['오픈소스 라이선스, 저작권 위반 등 권리 침해'].includes(values.category) && <>
												<h3 className='font-bold mt-2'>설명</h3>
												<p className='text-gray-400 text-sm mb-1'>최대한 자세하게 기재해주세요.</p>
												<TextField values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
											</>
										}
									</>
								}
							</div>
						</Form>
					)
				}
			</Formik>
		}
	</Container>
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const data = await get.user.load(ctx.query.id)
	const user = await get.Authorization(parsed?.token)
	
	return {
		props: {
			csrfToken: getToken(ctx.req, ctx.res),
			data,
			user: await get.user.load(user || '')
		},
	}
}

interface ReportUserProps {
	csrfToken: string
  data: User
  user: User
}

interface Context extends CsrfContext {
  query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}

export default ReportUser