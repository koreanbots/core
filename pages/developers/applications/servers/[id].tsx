import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useClipboard from 'react-use-clipboard'

import { get } from '@utils/Query'
import { cleanObject, parseCookie, redirectTo } from '@utils/Tools'
import { getToken } from '@utils/Csrf'
import Fetch from '@utils/Fetch'

import { ParsedUrlQuery } from 'querystring'
import { Server, BotSpec, ResponseProps, Theme, WebhookStatus } from '@types'

import NotFound from 'pages/404'
import Link from 'next/link'
import { DeveloperServer, DeveloperServerSchema } from '@utils/Yup'
import { Form, Formik } from 'formik'
import Tooltip from '@components/Tooltip'
import Input from '@components/Form/Input'

const Button = dynamic(() => import('@components/Button'))
const DeveloperLayout = dynamic(() => import('@components/DeveloperLayout'))
const ServerIcon = dynamic(() => import('@components/ServerIcon'))
const Message = dynamic(() => import('@components/Message'))
const Modal = dynamic(() => import('@components/Modal'))

const ServerApplication: NextPage<ServerApplicationProps> = ({
	user,
	spec,
	server,
	theme,
	csrfToken,
}) => {
	const router = useRouter()
	const [data, setData] = useState<ResponseProps<unknown>>(null)
	const [modalOpened, setModalOpen] = useState(false)
	const [showToken, setShowToken] = useState(false)
	const [tokenCopied, setTokenCopied] = useClipboard(spec?.token, {
		successDuration: 1000,
	})
	async function updateApplication(d: DeveloperServer) {
		const res = await Fetch(`/applications/servers/${server.id}`, {
			method: 'PATCH',
			body: JSON.stringify(cleanObject(d)),
		})
		setData(res)
	}

	async function resetToken() {
		const res = await Fetch<{ token: string }>(`/applications/servers/${server.id}/reset`, {
			method: 'POST',
			body: JSON.stringify({ token: spec.token, _csrf: csrfToken }),
		})
		setData(res)

		return res
	}

	if (!user && typeof window !== 'undefined') {
		localStorage.redirectTo = window.location.href
		redirectTo(router, 'login')
		return
	}
	if (!server) return <NotFound />
	return (
		<DeveloperLayout enabled='applications'>
			<Link href='/developers/applications' className='text-blue-500 hover:text-blue-400'>
				<i className='fas fa-arrow-left' />
				돌아가기
			</Link>
			<h1 className='text-3xl font-bold'>서버 설정</h1>
			<p className='text-gray-400'>
				한국 디스코드 리스트 API에 사용할 정보를 이곳에서 설정하실 수 있습니다.
			</p>
			{spec ? (
				<>
					<div className='pt-6 lg:flex'>
						<div className='lg:w-1/5'>
							<ServerIcon id={server.id} hash={server.icon} />
						</div>
						<div className='relative lg:w-4/5'>
							<div className='mt-4'>
								{!data ? (
									''
								) : data.code === 200 ? (
									<Message type='success'>
										<h2 className='text-lg font-extrabold'>수정 성공!</h2>
										<p>서버 정보를 저장했습니다.</p>
									</Message>
								) : (
									<Message type='error'>
										<h2 className='text-lg font-extrabold'>{data.message}</h2>
										<ul className='list-inside list-disc'>
											{data.errors?.map((el, i) => <li key={i}>{el}</li>)}
										</ul>
									</Message>
								)}
							</div>
							<div className='grid px-6 text-left'>
								<h2 className='mb-2 mt-3 text-3xl font-bold'>{server.name}</h2>
								<h3 className='text-lg font-semibold'>서버 토큰</h3>
								<pre className='w-full overflow-x-scroll text-sm'>
									{showToken ? spec.token : '******************'}
								</pre>
								<div className='pb-6 pt-3'>
									<Button onClick={() => setShowToken(!showToken)}>
										{showToken ? '숨기기' : '보기'}
									</Button>
									<Button
										onClick={setTokenCopied}
										className={tokenCopied ? 'bg-emerald-400 text-white' : null}
									>
										{tokenCopied ? '복사됨' : '복사'}
									</Button>
									<Button onClick={() => setModalOpen(true)}>재발급</Button>
									<Modal
										isOpen={modalOpened}
										onClose={() => setModalOpen(false)}
										dark={theme === 'dark'}
										header='정말로 토큰을 재발급하시겠습니까?'
									>
										<p>기존에 사용중이시던 토큰은 더 이상 사용하실 수 없습니다</p>
										<div className='pt-6 text-right'>
											<Button
												className='bg-gray-500 text-white hover:opacity-90'
												onClick={() => setModalOpen(false)}
											>
												취소
											</Button>
											<Button
												onClick={async () => {
													const res = await resetToken()
													if (res.data?.token) spec.token = res.data.token
													setModalOpen(false)
												}}
											>
												재발급
											</Button>
										</div>
									</Modal>
								</div>
								<Formik
									validationSchema={DeveloperServerSchema}
									initialValues={{
										webhookURL: spec.webhookURL || '',
										_csrf: csrfToken,
									}}
									onSubmit={updateApplication}
								>
									{({ errors, touched }) => (
										<Form>
											<div className='mb-2'>
												<h3 className='mb-1 font-bold'>
													웹훅 URL
													{(!data || data.code !== 200) &&
														spec.webhookStatus === WebhookStatus.Disabled && (
															<Tooltip
																direction='left'
																text='웹훅 링크가 유효하지 않아 웹훅이 중지되었습니다.'
															>
																<span
																	className='pl-1 text-base font-semibold text-red-500'
																	role='img'
																	aria-label='warning'
																>
																	⚠️
																</span>
															</Tooltip>
														)}
												</h3>
												<p className='mb-1 text-sm text-gray-400'>
													웹훅을 이용하여 한국 디스코드 리스트의 서버에 발생하는 이벤트를 받아볼 수
													있습니다.
													<br />
													웹훅 링크가 유효하지 않을 경우 웹훅이 중지되며, 다시 저장할 경우 다시
													활성화됩니다.
													<br />
													웹훅에 대한 자세한 내용은{' '}
													<Link
														href={'/developers/docs/%EC%9B%B9%ED%9B%84%ED%81%AC'}
														className='font-semibold text-blue-500 hover:text-blue-400'
													>
														개발자 문서
													</Link>
													에서 확인하실 수 있습니다.
												</p>
												<Input name='webhookURL' placeholder='https://webhook.koreanbots.dev' />
												{touched.webhookURL && errors.webhookURL ? (
													<div className='mt-1 text-xs font-light text-red-500'>
														{errors.webhookURL}
													</div>
												) : null}
											</div>
											<Button type='submit'>
												<i className='far fa-save' /> 저장
											</Button>
										</Form>
									)}
								</Formik>
							</div>
						</div>
					</div>
				</>
			) : (
				<div className='mt-5'>
					<Message type='error'>
						<h2 className='text-lg font-extrabold'>서버 정보를 불러올 수 없습니다.</h2>
						<p>서버에서 봇이 추방되었거나, 봇이 오프라인이여서 서버 정보를 갱신할 수 없습니다.</p>
					</Message>
				</div>
			)}
		</DeveloperLayout>
	)
}

interface ServerApplicationProps {
	user: string
	spec: BotSpec
	server: Server
	csrfToken: string
	theme: Theme
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const user = (await get.Authorization(parsed?.token)) || ''
	const server = await get.server.load(ctx.query.id)
	return {
		props: {
			user,
			spec: server?.state === 'unreachable' ? null : await get.serverSpec(ctx.query.id, user),
			server,
			csrfToken: getToken(ctx.req, ctx.res),
		},
	}
}

interface Context extends NextPageContext {
	query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
	id: string
}

export default ServerApplication
