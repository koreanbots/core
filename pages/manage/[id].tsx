import { NextPage, NextPageContext } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Form, Formik } from 'formik'
import { ParsedUrlQuery } from 'node:querystring'
import { getJosaPicker } from 'josa'

import { get } from '@utils/Query'
import { checkUserFlag, cleanObject, makeBotURL, parseCookie, redirectTo } from '@utils/Tools'
import { ManageBot, ManageBotSchema } from '@utils/Yup'
import { categories, library } from '@utils/Constants'
import { Bot, Theme, User } from '@types'
import { getToken } from '@utils/Csrf'
import Fetch from '@utils/Fetch'

import NotFound from 'pages/404'
import Forbidden from '@components/Forbidden'

const Label = dynamic(() => import('@components/Form/Label'))
const Input = dynamic(() => import('@components/Form/Input'))
const Divider = dynamic(() => import('@components/Divider'))
const Redirect = dynamic(() => import('@components/Redirect'))
const TextArea = dynamic(() => import('@components/Form/TextArea'))
const Segment = dynamic(() => import('@components/Segment'))
const Markdown = dynamic(() => import('@components/Markdown'))
const Select = dynamic(() => import('@components/Form/Select'))
const Selects = dynamic(() => import('@components/Form/Selects'))
const Button = dynamic(() => import('@components/Button'))
const Container = dynamic(() => import('@components/Container'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const Tag = dynamic(() => import('@components/Tag'))
const Message = dynamic(() => import('@components/Message'))
const Modal = dynamic(() => import('@components/Modal'))
const Captcha = dynamic(() => import('@components/Captcha'))
const SEO = dynamic(() => import('@components/SEO'))
const Login = dynamic(() => import('@components/Login'))

const ManageBotPage:NextPage<ManageBotProps> = ({ bot, user, csrfToken, theme }) => {
	const [ data, setData ] = useState(null)
	const [ adminModal, setAdminModal ] = useState(false)
	const [ transferModal, setTransferModal ] = useState(false)
	const [ deleteModal, setDeleteModal ] = useState(false)
	const router = useRouter()

	async function submitBot(value: ManageBot) {
		const res = await Fetch(`/bots/${bot.id}`, { method: 'PATCH', body: JSON.stringify(cleanObject<ManageBot>(value)) })
		setData(res)
	}

	async function getUser(id: string) {
		const u = await Fetch<User>(`/users/${encodeURIComponent(id)}`)
		if(u.code === 200 && u.data) return u.data
		else return null
	}

	if(!bot) return <NotFound />
	if(!user) return <Login>
		<SEO title='봇 정보 수정하기' description='봇의 정보를 수정합니다.'/>
	</Login>
	if(!(bot.owners as User[]).find(el => el.id === user.id) && !checkUserFlag(user.flags, 'staff')) return <Forbidden />
	return <Container paddingTop className='pt-5 pb-10'>
		<SEO title={`${bot.name} 수정하기`} description='봇의 정보를 수정합니다.'/>
		<h1 className='text-3xl font-bold mb-8'>봇 관리하기</h1>
		<Formik initialValues={cleanObject({
			agree: false,
			id: bot.id,
			prefix: bot.prefix,
			library: bot.lib,
			category: bot.category,
			intro: bot.intro,
			desc: bot.desc,
			website: bot.web,
			url: bot.url,
			git: bot.git,
			discord: bot.discord,
			_csrf: csrfToken
		})}
		validationSchema={ManageBotSchema}
		onSubmit={submitBot}>
			{({ errors, touched, values, setFieldTouched, setFieldValue }) => (
				<Form>
					<div className='md:flex text-center md:text-left'>
						<DiscordAvatar userID={bot.id} className='md:mx-1 mx-auto'/>
						<div className='md:w-2/3 px-8 py-6'>
							<h1 className='text-3xl font-bold'>{bot.name}#{bot.tag}</h1>
							<h2>ID: {bot.id}</h2>
						</div>
					</div>
					{
						data ? data.code === 200 ? <div className='mt-4'>
							<Redirect to={makeBotURL(bot)}>
								<Message type='success'>
									<h2 className='text-lg font-black'>정보를 저장했습니다.</h2>
									<p>반영까지는 시간이 조금 걸릴 수 있습니다!</p>
								</Message>
							</Redirect>
							
						</div> : <div className='mt-4'>
							<Message type='error'>
								<h2 className='text-lg font-black'>{data.message || '오류가 발생했습니다.'}</h2>
								<ul className='list-disc list-inside'>
									{data.errors?.map((el, n) => <li key={n}>{el}</li>)}
								</ul>
							</Message>
						</div> : ''
					}
					<Label For='prefix' label='접두사' labelDesc='봇의 사용시 앞 쪽에 붙은 기호를 의미합니다. (Prefix)' error={errors.prefix && touched.prefix ? errors.prefix : null} short required>
						<Input name='prefix' placeholder='!' />
					</Label>
					<Label For='library' label='라이브러리' labelDesc='봇에 사용된 라이브러리를 선택해주세요. 해당되는 라이브러리가 없다면 기타를 선택해주세요.' short required error={errors.library && touched.library ? errors.library : null}>
						<Select value={{ label: bot.lib, value: bot.lib }} options={library.map(el=> ({ label: el, value: el }))} handleChange={(value) => setFieldValue('library', value.value)} handleTouch={() => setFieldTouched('library', true)} />
					</Label>
					<Label For='category' label='카테고리' labelDesc='봇에 해당되는 카테고리를 선택해주세요' required error={errors.category && touched.category ? errors.category as string : null}>
						<Selects options={categories.map(el=> ({ label: el, value: el }))} handleChange={(value) => {
							setFieldValue('category', value.map(v=> v.value))
						}} handleTouch={() => setFieldTouched('category', true)} values={values.category as string[]} setValues={(value) => setFieldValue('category', value)} />
						<span className='text-gray-400 mt-1 text-sm'>봇 카드에는 앞 3개의 카테고리만 표시됩니다. 드래그하여 카테고리를 정렬하세요. <strong>반드시 해당되는 카테고리만 선택해주세요.</strong></span>
					</Label>
					<Divider />
					<Label For='website' label='웹사이트' labelDesc='봇의 웹사이트를 작성해주세요.' error={errors.website && touched.website ? errors.website : null}>
						<Input name='website' placeholder='https://koreanbots.dev' />
					</Label>
					<Label For='git' label='깃 URL' labelDesc='봇의 소스코드 깃 주소를 입력해주세요 (오픈소스인 경우)' error={errors.git && touched.git ? errors.git : null}>
						<Input name='git' placeholder='https://github.com/koreanbots/koreanbots'/>
					</Label>
					<Label For='inviteLink' label='초대링크' labelDesc='봇의 초대링크입니다. 비워두시면 자동으로 생성합니다.' error={errors.url && touched.url ? errors.url : null}>
						<Input name='url' placeholder='https://discord.com/oauth2/authorize?client_id=653534001742741552&scope=bot&permissions=0' />
						<span className='text-gray-400 mt-1 text-sm'>
							<Link href='/calculator'>
								<a rel='noreferrer' target='_blank' className='text-blue-500 hover:text-blue-400'>이곳</a>
							</Link>에서 초대링크를 생성하실 수 있습니다!
						</span>
					</Label>
					{
						values.category.includes('빗금 명령어') && <Message type='warning'>
							<h2 className='text-lg font-semibold'>해당 봇은 빗금 명령어(Slash Command) 카테고리가 선택되었습니다.</h2>
							<p>초대링크는 빗금 명령어 권한을 부여하지 않은 일반 봇 초대링크로 자동 생성됩니다.
								따라서 빗금 명령어 권한을 포함한 초대링크를 직접 설정해주세요.</p>
						</Message>
					}
					<Label For='discord' label='지원 디스코드 서버' labelDesc='봇의 지원 디스코드 서버를 입력해주세요. (봇에 대해 도움을 받을 수 있는 공간입니다.)' error={errors.discord && touched.discord ? errors.discord : null} short>
						<div className='flex items-center'>
						discord.gg/<Input name='discord' placeholder='JEh53MQ' />
						</div>
					</Label>
					<Divider />
					<Label For='intro' label='봇 소개' labelDesc='봇을 소개할 수 있는 간단한 설명을 적어주세요. (최대 60자)' error={errors.intro && touched.intro ? errors.intro : null} required>
						<Input name='intro' placeholder='국내 봇을 한 곳에서.' />
					</Label>
					<Label For='intro' label='봇 설명' labelDesc={<>봇을 자세하게 설명해주세요! (최대 1500자)<br/>마크다운을 지원합니다!</>} error={errors.desc && touched.desc ? errors.desc : null} required>
						<TextArea name='desc' placeholder='봇에 대해 최대한 자세히 설명해주세요!' theme={theme === 'dark' ? 'dark' : 'light'} value={values.desc} setValue={(value) => setFieldValue('desc', value)} />
					</Label>
					<Label For='preview' label='설명 미리보기' labelDesc='다음 결과는 실제와 다를 수 있습니다'>
						<Segment>
							<Markdown text={values.desc} />
						</Segment>
					</Label>
					<Divider />
					<p className='text-base mt-2 mb-5'>
						<span className='text-red-500 font-semibold'> *</span> = 필수 항목
					</p>
					<Button type='submit' onClick={() => window.scrollTo({ top: 0 })}>
						<>
							<i className='far fa-save'/> 저장
						</>
					</Button>
				</Form>
			)}
		</Formik>
		{
			(checkUserFlag(user.flags, 'staff') || (bot.owners as User[])[0].id === user.id) && <div className='py-4'>
				<Divider />
				<h2 className='text-2xl font-semibold pb-2'>위험구역</h2>
				<Segment>
					<div className='lg:flex items-center'>
						<div className='flex-grow py-1'>
							<h3 className='text-lg font-semibold'>관리자 수정</h3>
							<p className='text-gray-400'>봇의 관리자를 추가하거나 삭제합니다.</p>
						</div>
						<Button onClick={() => setAdminModal(true)} className='h-10 bg-red-500 hover:opacity-80 text-white lg:w-1/8'><i className='fas fa-user-cog' /> 관리자 수정</Button>
						<Modal full header='관리자 수정' isOpen={adminModal} dark={theme === 'dark'} onClose={() => setAdminModal(false)} closeIcon>
							<Formik initialValues={{ owners: (bot.owners as User[]), id: '', _captcha: '' }} onSubmit={async (v) => {
								const res = await Fetch(`/bots/${bot.id}/owners`, { method: 'PATCH', body: JSON.stringify({
									_captcha: v._captcha,
									_csrf: csrfToken,
									owners: v.owners.map(el => el.id)
								}) })
								if(res.code === 200) {
									alert('성공적으로 수정했습니다.')
									router.push(makeBotURL(bot))
								} else {
									alert(res.message)
									setAdminModal(false)
								}
							}}>
								{
									({ values, setFieldValue }) => <Form>
										<Message type='warning'>
											<p>소유자는 삭제할 수 없습니다. 소유권을 이전하고 싶으시다면 소유권 이전을 사용해주세요.</p>
										</Message>
										<div className='py-4'>
											<h2 className='text-md my-1'>이전하실 유저 ID를 입력해주세요.</h2>
											<div className='flex flex-wrap'>
												{
													(values.owners as User[]).map((el, n) => <Tag className='flex items-center' text={<>
														<DiscordAvatar userID={el.id} size={128} className='w-6 h-6 mr-1 rounded-full' /> {el.username}#{el.tag}
														{
															n !== 0 && <button className='ml-0.5 hover:text-red-500' onClick={() => {
																setFieldValue('owners', (() => {
																	const arr = [...values.owners]
																	arr.splice(n, 1)
																	return arr
																})())
															}}>
																<i className='fas fa-times' />
															</button>
														}
													</>} key={el.id} />)
												}
											</div>
											<div className='flex'>
												<div className='flex-grow pr-2'>
													<Input name='id' placeholder='추가할 유저 ID' />
												</div>
												<Button className='w-16 bg-discord-blurple' onClick={async () => {
													if(values.owners.find(el => el.id === values.id)) return alert('이미 존재하는 유저입니다.')
													const user = await getUser(values.id)
													const arr = [...values.owners]
													if(!user) return alert('올바르지 않은 유저입니다.')
													else {
														arr.push(user)
														setFieldValue('owners', arr)
														setFieldValue('id', '')
													}
												}}>
													<i className='fas fa-user-plus text-white' />
												</Button>
											</div>
										</div>
										<Captcha dark={theme === 'dark'} onVerify={(k) => setFieldValue('_captcha', k)} />
										<Button disabled={!values._captcha} className={`mt-2 bg-red-500 text-white ${!values._captcha ? 'opacity-80' : 'hover:opacity-80'}`} type='submit'><i className='fas fa-save text-sm' /> 저장</Button>
									</Form>
								}
							</Formik>
						</Modal>
					</div>
					<Divider />
					<div className='lg:flex items-center'>
						<div className='flex-grow py-1'>
							<h3 className='text-lg font-semibold'>소유권 이전</h3>
							<p className='text-gray-400'>봇의 소유권을 이전합니다. 소유권을 이전하게 되면 소유권을 잃게 됩니다.</p>
						</div>
						<Button onClick={() => setTransferModal(true)} className='h-10 bg-red-500 hover:opacity-80 text-white lg:w-1/8'><i className='fas fa-exchange-alt' /> 소유권 이전</Button>
						<Modal full header={`${bot.name} 소유권 이전하기`} isOpen={transferModal} dark={theme === 'dark'} onClose={() => setTransferModal(false)} closeIcon>
							<Formik initialValues={{ ownerID: '', name: '', _captcha: '' }} onSubmit={async (v) => {
								const res = await Fetch(`/bots/${bot.id}/owners`, { method: 'PATCH', body: JSON.stringify({
									_captcha: v._captcha,
									_csrf: csrfToken,
									owners: [ v.ownerID ]
								}) })
								if(res.code === 200) {
									alert('성공적으로 소유권을 이전했습니다.')
									router.push('/')
								} else {
									alert(res.message)
									setTransferModal(false)
								}
							}}>
								{
									({ values, setFieldValue }) => <Form>
										<Message type='warning'>
											<h2 className='text-2xl font-bold'>주의해주세요!</h2>
											<p>봇의 소유권을 이전하게 되면 봇의 소유자 권한을 이전하게 되며, 본인을 포함한 모든 관리자가 해당 봇에 대한 권한을 잃게됩니다.</p>
										</Message>
										<div className='py-4'>
											<h2 className='text-md my-1'>이전하실 유저 ID를 입력해주세요.</h2>
											<Input name='ownerID' placeholder='이전할 유저 ID' />
											<Divider />
											<h2 className='text-md my-1'>계속 하시려면 <strong>{bot.name}</strong>{getJosaPicker('을')(bot.name)} 입력해주세요.</h2>
											<Input name='name' placeholder={bot.name} />
										</div>
										<Captcha dark={theme === 'dark'} onVerify={(k) => setFieldValue('_captcha', k)} />
										<Button disabled={!values.ownerID || values.name !== bot.name || !values._captcha} className={`mt-4 bg-red-500 text-white ${!values.ownerID ||values.name !== bot.name || !values._captcha ? 'opacity-80' : 'hover:opacity-80'}`} type='submit'><i className='fas fa-exchange-alt' /> 소유권 이전</Button>
									</Form>
								}
							</Formik>
						</Modal>
					</div>
					<Divider />
					<div className='lg:flex items-center'>
						<div className='flex-grow py-1'>
							<h3 className='text-lg font-semibold'>봇 삭제하기</h3>
							<p className='text-gray-400'>봇을 삭제하게 되면 되돌릴 수 없습니다.</p>
						</div>
						<Button onClick={() => setDeleteModal(true)} className='h-10 bg-red-500 hover:opacity-80 text-white lg:w-1/8'><i className='fas fa-trash' /> 봇 삭제하기</Button>
						<Modal full header={`${bot.name} 삭제하기`} isOpen={deleteModal} dark={theme === 'dark'} onClose={() => setDeleteModal(false)} closeIcon>
							<Formik initialValues={{ name: '', _captcha: '', _csrf: csrfToken }} onSubmit={async (v) => {
								const res = await Fetch(`/bots/${bot.id}`, { method: 'DELETE', body: JSON.stringify(v) })
								if(res.code === 200) {
									alert('성공적으로 삭제하였습니다.')
									redirectTo(router, '/')
								}
								else alert(res.message)
							}}>
								{
									({ values, setFieldValue }) => <Form>
										<Message type='warning'>
											<p>봇을 삭제하게 되면 되돌릴 수 없습니다.<br/>하트 수를 포함한 모든 봇 정보가 영구적으로 삭제됩니다.</p>
											<p>계속 하시려면 봇의 이름 <strong>{bot.name}</strong>{getJosaPicker('을')(bot.name)} 입력해주세요.</p>
										</Message>
										<div className='py-4'>
											<Input name='name' placeholder={bot.name} />
										</div>
										<Captcha dark={theme === 'dark'} onVerify={(k) => setFieldValue('_captcha', k)} />
										<Button disabled={values.name !== bot.name || !values._captcha} className={`mt-4 bg-red-500 text-white ${values.name !== bot.name || !values._captcha ? 'opacity-80' : 'hover:opacity-80'}`} type='submit'><i className='fas fa-trash' /> 삭제</Button>
									</Form>
								}
							</Formik>
						</Modal>
					</div>
				</Segment>
			</div>
		}
	</Container>
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token)
	return { props: { bot: await get.bot.load(ctx.query.id), user: await get.user.load(user || ''), csrfToken: getToken(ctx.req, ctx.res) } }
}

interface ManageBotProps {
	bot: Bot
	user: User
	csrfToken: string
	theme: Theme
}

interface Context extends NextPageContext {
	query: Query
}

interface Query extends ParsedUrlQuery {
	id: string
}

export default ManageBotPage