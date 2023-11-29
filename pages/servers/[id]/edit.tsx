import { NextPage, NextPageContext } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'
import { Form, Formik } from 'formik'
import { ParsedUrlQuery } from 'querystring'
import { getJosaPicker } from 'josa'

import { get } from '@utils/Query'
import {
	checkUserFlag,
	cleanObject,
	getRandom,
	makeServerURL,
	parseCookie,
	redirectTo,
} from '@utils/Tools'
import { ManageServer, ManageServerSchema } from '@utils/Yup'
import { serverCategories, ServerIntroList } from '@utils/Constants'
import { Server, Theme, User } from '@types'
import { getToken } from '@utils/Csrf'
import Fetch from '@utils/Fetch'

import NotFound from 'pages/404'

const Label = dynamic(() => import('@components/Form/Label'))
const Input = dynamic(() => import('@components/Form/Input'))
const Divider = dynamic(() => import('@components/Divider'))
const Redirect = dynamic(() => import('@components/Redirect'))
const TextArea = dynamic(() => import('@components/Form/TextArea'))
const Segment = dynamic(() => import('@components/Segment'))
const Markdown = dynamic(() => import('@components/Markdown'))
const Selects = dynamic(() => import('@components/Form/Selects'))
const Button = dynamic(() => import('@components/Button'))
const Container = dynamic(() => import('@components/Container'))
const ServerIcon = dynamic(() => import('@components/ServerIcon'))
const Message = dynamic(() => import('@components/Message'))
const Modal = dynamic(() => import('@components/Modal'))
const Captcha = dynamic(() => import('@components/Captcha'))
const Login = dynamic(() => import('@components/Login'))
const Forbidden = dynamic(() => import('@components/Forbidden'))

const ManageServerPage: NextPage<ManageServerProps> = ({
	server,
	user,
	owners,
	csrfToken,
	theme,
}) => {
	const [data, setData] = useState(null)
	const [deleteModal, setDeleteModal] = useState(false)
	const router = useRouter()

	async function submitServer(value: ManageServer) {
		const res = await Fetch(`/servers/${server.id}`, {
			method: 'PATCH',
			body: JSON.stringify(cleanObject<ManageServer>(value)),
		})
		setData(res)
	}

	if (!server) return <NotFound />
	if (!user)
		return (
			<Login>
				<NextSeo title='서버 정보 수정하기' description='서버의 정보를 수정합니다.' />
			</Login>
		)
	if (!(owners as User[]).find((el) => el.id === user.id) && !checkUserFlag(user.flags, 'staff'))
		return <Forbidden />
	return (
		<Container paddingTop className='pb-10 pt-5'>
			<NextSeo title={`${server.name} 수정하기`} description='서버의 정보를 수정합니다.' />
			<h1 className='mb-8 text-3xl font-bold'>서버 관리하기</h1>
			<Formik
				initialValues={cleanObject({
					invite: server.invite,
					intro: server.intro,
					desc: server.desc,
					category: server.category,
					_csrf: csrfToken,
				})}
				validationSchema={ManageServerSchema}
				onSubmit={submitServer}
			>
				{({ errors, touched, values, setFieldTouched, setFieldValue }) => (
					<Form>
						<div className='text-center md:flex md:text-left'>
							<ServerIcon id={server.id} className='mx-auto rounded-full md:mx-1' />
							<div className='px-8 py-6 md:w-2/3'>
								<h1 className='text-3xl font-bold'>{server.name}</h1>
								<h2>ID: {server.id}</h2>
							</div>
						</div>
						{data ? (
							data.code === 200 ? (
								<div className='mt-4'>
									<Redirect to={makeServerURL(server)}>
										<Message type='success'>
											<h2 className='text-lg font-extrabold'>정보를 저장했습니다.</h2>
											<p>반영까지는 시간이 조금 걸릴 수 있습니다!</p>
										</Message>
									</Redirect>
								</div>
							) : (
								<div className='mt-4'>
									<Message type='error'>
										<h2 className='text-lg font-extrabold'>
											{data.message || '오류가 발생했습니다.'}
										</h2>
										<ul className='list-inside list-disc'>
											{data.errors?.map((el, n) => <li key={n}>{el}</li>)}
										</ul>
									</Message>
								</div>
							)
						) : (
							''
						)}
						<Label
							For='category'
							label='카테고리'
							labelDesc='서버에 해당되는 카테고리를 선택해주세요'
							required
							error={errors.category && touched.category ? (errors.category as string) : null}
						>
							<Selects
								options={serverCategories.map((el) => ({ label: el, value: el }))}
								handleChange={(value) => {
									setFieldValue(
										'category',
										value.map((v) => v.value)
									)
								}}
								handleTouch={() => setFieldTouched('category', true)}
								values={values.category as string[]}
								setValues={(value) => setFieldValue('category', value)}
							/>
							<span className='mt-1 text-sm text-gray-400'>
								서버 카드에는 앞 3개의 카테고리만 표시됩니다. 드래그하여 카테고리를 정렬하세요.{' '}
								<strong>반드시 해당되는 카테고리만 선택해주세요.</strong>
							</span>
						</Label>
						<Label
							For='invite'
							label='서버 초대코드'
							labelDesc='서버의 초대코드를 입력해주세요. (만료되지 않는 코드로 입력해주세요!)'
							error={errors.invite && touched.invite ? errors.invite : null}
							short
							required
						>
							<div className='flex items-center'>
								discord.gg/
								<Input name='invite' placeholder='JEh53MQ' />
							</div>
						</Label>
						<Divider />
						<Label
							For='intro'
							label='서버 소개'
							labelDesc='서버를 소개할 수 있는 간단한 설명을 적어주세요. (최대 60자)'
							error={errors.intro && touched.intro ? errors.intro : null}
							required
						>
							<Input name='intro' placeholder={getRandom(ServerIntroList)} />
						</Label>
						<Label
							For='desc'
							label='서버 설명'
							labelDesc={
								<>
									서버를 자세하게 설명해주세요! (최대 1500자)
									<br />
									마크다운을 지원합니다!
								</>
							}
							error={errors.desc && touched.desc ? errors.desc : null}
							required
						>
							<TextArea
								max={1500}
								name='desc'
								placeholder='서버에 대해 최대한 자세히 설명해주세요!'
								theme={theme === 'dark' ? 'dark' : 'light'}
								value={values.desc}
								setValue={(value) => setFieldValue('desc', value)}
							/>
						</Label>
						<Label
							For='preview'
							label='설명 미리보기'
							labelDesc='다음 결과는 실제와 다를 수 있습니다.'
						>
							<Segment>
								<Markdown text={values.desc} />
							</Segment>
						</Label>
						<Divider />
						<p className='mb-5 mt-2 text-base'>
							<span className='font-semibold text-red-500'> *</span> = 필수 항목
						</p>
						<Button type='submit' onClick={() => window.scrollTo({ top: 0 })}>
							<>
								<i className='far fa-save' /> 저장
							</>
						</Button>
					</Form>
				)}
			</Formik>
			{(checkUserFlag(user.flags, 'staff') || server.owner?.id === user.id) && (
				<div className='py-4'>
					<Divider />
					<h2 className='pb-2 text-2xl font-semibold'>위험구역</h2>
					<p className='mb-3 text-gray-400'>
						관리자 추가나 소유권 이전은 웹사이트에서 진행하실 수 없습니다. 디스코드 서버 내에서
						"관리자" 권한을 부여하시거나 서버의 소유권을 이전하시면 됩니다.
					</p>
					<Segment>
						<div className='items-center lg:flex'>
							<div className='grow py-1'>
								<h3 className='text-lg font-semibold'>서버 삭제하기</h3>
								<p className='text-gray-400'>서버를 삭제하게 되면 되돌릴 수 없습니다.</p>
							</div>

							<Button
								onClick={() => setDeleteModal(true)}
								className='lg:w-1/8 h-10 bg-red-500 text-white hover:opacity-80'
							>
								<i className='fas fa-trash' /> 서버 삭제하기
							</Button>
							<Modal
								full
								header={`${server.name} 삭제하기`}
								isOpen={deleteModal}
								dark={theme === 'dark'}
								onClose={() => setDeleteModal(false)}
								closeIcon
							>
								<Formik
									initialValues={{ name: '', _captcha: '', _csrf: csrfToken }}
									onSubmit={async (v) => {
										const res = await Fetch(`/servers/${server.id}`, {
											method: 'DELETE',
											body: JSON.stringify(v),
										})
										if (res.code === 200) {
											alert('성공적으로 삭제하였습니다.')
											redirectTo(router, '/')
										} else alert(res.message)
									}}
								>
									{({ values, setFieldValue }) => (
										<Form>
											<Message type='warning'>
												<p>
													서버를 삭제하게 되면 되돌릴 수 없습니다.
													<br />
													하트 수를 포함한 모든 서버 정보가 영구적으로 삭제됩니다.
												</p>
												<p>
													계속 하시려면 서버의 이름 <strong>{server.name}</strong>
													{getJosaPicker('을')(server.name)} 입력해주세요.
												</p>
											</Message>
											<div className='py-4'>
												<Input name='name' placeholder={server.name} />
											</div>
											<Captcha
												dark={theme === 'dark'}
												onVerify={(k) => setFieldValue('_captcha', k)}
											/>
											<Button
												disabled={values.name !== server.name || !values._captcha}
												className={`mt-4 bg-red-500 text-white ${
													values.name !== server.name || !values._captcha
														? 'opacity-80'
														: 'hover:opacity-80'
												}`}
												type='submit'
											>
												<i className='fas fa-trash' /> 삭제
											</Button>
										</Form>
									)}
								</Formik>
							</Modal>
						</div>
					</Segment>
				</div>
			)}
		</Container>
	)
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token)
	return {
		props: {
			server: await get.server.load(ctx.query.id),
			user: await get.user.load(user || ''),
			owners: await get.serverOwners(ctx.query.id),
			csrfToken: getToken(ctx.req, ctx.res),
		},
	}
}

interface ManageServerProps {
	server: Server
	user: User
	owners: User[]
	csrfToken: string
	theme: Theme
}

interface Context extends NextPageContext {
	query: Query
}

interface Query extends ParsedUrlQuery {
	id: string
}

export default ManageServerPage
