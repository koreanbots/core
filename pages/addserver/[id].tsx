import { NextPage, NextPageContext } from 'next'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { Form, Formik } from 'formik'
import HCaptcha from '@hcaptcha/react-hcaptcha'

import { get } from '@utils/Query'
import { cleanObject, getRandom, parseCookie, redirectTo } from '@utils/Tools'
import { AddServerSubmitSchema, AddServerSubmit } from '@utils/Yup'
import { serverCategories, ServerIntroList } from '@utils/Constants'
import { getToken } from '@utils/Csrf'
import Fetch from '@utils/Fetch'
import { ResponseProps, Server, ServerData, Theme, User } from '@types'
import Forbidden from '@components/Forbidden'

const CheckBox = dynamic(() => import('@components/Form/CheckBox'))
const Label = dynamic(() => import('@components/Form/Label'))
const Login = dynamic(() => import('@components/Login'))
const Input = dynamic(() => import('@components/Form/Input'))
const Divider = dynamic(() => import('@components/Divider'))
const TextArea = dynamic(() => import('@components/Form/TextArea'))
const Segment = dynamic(() => import('@components/Segment'))
const Markdown = dynamic(() => import('@components/Markdown'))
const Selects = dynamic(() => import('@components/Form/Selects'))
const Button = dynamic(() => import('@components/Button'))
const Container = dynamic(() => import('@components/Container'))
const Message = dynamic(() => import('@components/Message'))
const Captcha = dynamic(() => import('@components/Captcha'))

const AddServer:NextPage<AddServerProps> = ({ logged, user, csrfToken, server, serverData, theme }) => {
	const [ data, setData ] = useState<ResponseProps<AddServerSubmit>>(null)
	const [ captcha, setCaptcha ] = useState(false)
	const [ touchedSumbit, setTouched ] = useState(false)
	const captchaRef = useRef<HCaptcha>()
	const router = useRouter()
	const initialValues: AddServerSubmit = {
		agree: false,
		invite: '',
		intro: '',
		desc: `<!-- 이 설명을 지우시고 원하시는 설명을 적으셔도 좋습니다! -->
# 서버 이름

자신의 서버를 자유롭게 표현해보세요!

## ✏️ 소개

무엇이 목적인 서버인가요?

어떤 주제인가요?

## 💬 특징

- 어떤
- 특징이
- 있나요?`,
		category: [],
		_csrf: csrfToken,
		_captcha: 'captcha'
	}

	function toLogin() {
		localStorage.redirectTo = window.location.href
		redirectTo(router, 'login')
	}
	
	async function submitServer(id: string, value: AddServerSubmit, token: string) {
		const res = await Fetch<AddServerSubmit>(`/servers/${id}`, { method: 'POST', body: JSON.stringify(cleanObject<AddServerSubmit>({ ...value, _captcha: token })) })
		setData(res)
	}

	if(!logged) return <Login>
		<NextSeo title='새로운 서버 추가하기' description='자신의 서버를 한국 디스코드 리스트에 등록하세요.' openGraph={{
			title:'새로운 서버 추가하기', description: '자신의 서버를 한국 디스코드 리스트에 등록하세요.'
		}} />
	</Login>
	return <Container paddingTop className='py-5'>
		<NextSeo title='새로운 서버 추가하기' description='자신의 서버를 한국 디스코드 리스트에 등록하세요.' openGraph={{
			title:'새로운 서버 추가하기', description: '자신의 서버를 한국 디스코드 리스트에 등록하세요.'
		}} />
		<h1 className='text-3xl font-bold'>새로운 서버 추가하기</h1>
		<div className='mt-1 mb-5'>
			안녕하세요, <span className='font-semibold'>{user.username}#{user.tag}</span>님! <a role='button' tabIndex={0} onKeyDown={toLogin} onClick={toLogin} className='text-discord-blurple cursor-pointer outline-none'>본인이 아니신가요?</a>
		</div>
		{
			data ? data.code == 200 && data.data ? <Message type='success'>
				<h2 className='text-lg font-black'>서버 등록 성공!</h2>
				<p>서버를 성공적으로 등록했습니다! 심사 페이지로 리다이랙트됩니다. {redirectTo(router, `/servers/${router.query.id}`)}</p>
			</Message> : <Message type='error'>
				<h2 className='text-lg font-black'>{data.message || '오류가 발생했습니다.'}</h2>
				<ul className='list-disc list-inside'>
					{data.errors?.map((el, n) => <li key={n}>{el}</li>)}
				</ul>
				
			</Message> : <></>
		}
		{
			server ? <Message type='warning'>
				<h2 className='text-lg font-black'>이미 등록된 서버입니다.</h2>
			</Message> :
				!serverData ? <Message type='info'>
					<h2 className='text-lg font-black'>서버에 봇이 초대되지 않았습니다.</h2>
					<p>서버를 등록하시려면 먼저 봇을 초대해야합니다.</p>
					<p>서버에 이미 봇이 초대되었다면 반영까지 최대 1분이 소요될 수 있습니다.</p>
				</Message>
					: serverData.admins.includes(user.id) || serverData.owner.includes(user.id) ? <Formik initialValues={initialValues}
						validationSchema={AddServerSubmitSchema}
						onSubmit={() => setCaptcha(true)}>
						{({ errors, touched, values, isValid, setFieldTouched, setFieldValue }) => (
							<Form>
								<div className='py-3'>
									<Message type='warning'>
										<h2 className='text-lg font-black'>등록하시기 전에 다음 사항을 확인해 주세요!</h2>
										<ul className='list-disc list-inside'>
											<li><Link href='/discord'><a rel='noreferrer' target='_blank' className='text-blue-500 hover:text-blue-600'>디스코드 서버</a></Link>에 참여를 권장드립니다.</li>
											<li>서버가 <Link href='/guidelines'><a rel='noreferrer' target='_blank' className='text-blue-500 hover:text-blue-600'>가이드라인</a></Link>을 지키고 있나요?</li>
											<li>서버에서 <strong>관리자</strong> 권한을 갖고 있는 모든 분은 삭제를 제외한 모든 행동을 할 수 있습니다.</li>
											<li>서버를 등록한 이후 봇을 추방하시게 되면 서버 정보가 웹에 업데이트 되지 않습니다.</li>
											<li>또한, 서버를 등록하게 되면 작성하신 모든 정보와 서버에서 수집된 정보는 웹과 API에 공개됩니다.</li>
										</ul>
									</Message>
								</div>
								<Label For='agree' error={errors.agree && touched.agree ? errors.agree : null} grid={false}>
									<div className='flex items-center'>
										<CheckBox name='agree' />
										<strong className='text-sm ml-2'>해당 내용을 숙지하였으며, 등록 이후에 가이드라인을 위반하여 서버가 웹에서 삭제될 수 있다는 점을 확인했습니다.</strong>
									</div>
								</Label>
								<Divider />
								<Label For='id' label='서버' labelDesc='등록하시는 대상 서버 입니다.'>
									<p>
										<strong>{serverData.name}</strong>
										<br/> ID: {router.query.id}
									</p>
								</Label>
								<Divider />
								<Label For='category' label='카테고리' labelDesc='서버에 해당되는 카테고리를 선택해주세요' required error={errors.category && touched.category ? errors.category as string : null}>
									<Selects options={serverCategories.map(el=> ({ label: el, value: el }))} handleChange={(value) => {
										setFieldValue('category', value.map(v=> v.value))
									}} handleTouch={() => setFieldTouched('category', true)} values={values.category as string[]} setValues={(value) => setFieldValue('category', value)} />
									<span className='text-gray-400 mt-1 text-sm'>서버 카드에는 앞 3개의 카테고리만 표시됩니다. 드래그하여 카테고리를 정렬하세요. <strong>반드시 해당되는 카테고리만 선택해주세요.</strong></span>
								</Label>
								<Label For='invite' label='서버 초대코드' labelDesc='서버의 초대코드를 입력해주세요. (만료되지 않는 코드로 입력해주세요!)' error={errors.invite && touched.invite ? errors.invite : null} short required>
									<div className='flex items-center'>
										discord.gg/<Input name='invite' placeholder='JEh53MQ' />
									</div>
								</Label>
								<Divider />
								<Label For='intro' label='서버 소개' labelDesc='서버를 소개할 수 있는 간단한 설명을 적어주세요. (최대 60자)' error={errors.intro && touched.intro ? errors.intro : null} required>
									<Input name='intro' placeholder={getRandom(ServerIntroList)} />
								</Label>
								<Label For='desc' label='서버 설명' labelDesc={<>서버를 자세하게 설명해주세요! (최대 1500자)<br/>마크다운을 지원합니다!</>} error={errors.desc && touched.desc ? errors.desc : null} required>
									<TextArea max={1500} name='desc' placeholder='서버에 대해 최대한 자세히 설명해주세요!' theme={theme === 'dark' ? 'dark' : 'light'} value={values.desc} setValue={(value) => setFieldValue('desc', value)} />
								</Label>
								<Label For='preview' label='설명 미리보기' labelDesc='다음 결과는 실제와 다를 수 있습니다.'>
									<Segment>
										<Markdown text={values.desc} />
									</Segment>
								</Label>
								<Divider />
								<p className='text-base mt-2 mb-5'>
									<span className='text-red-500 font-semibold'> *</span> = 필수 항목
								</p>
								{
									captcha ? <Captcha ref={captchaRef} dark={theme === 'dark'} onVerify={(token) => {
										submitServer(router.query.id as string, values, token)
										window.scrollTo({ top: 0 })
										setCaptcha(false)
										captchaRef?.current?.resetCaptcha()
									}} /> : <>
										{
											touchedSumbit && !isValid && <div className='my-1 text-red-500 text-xs font-light'>누락되거나 잘못된 항목이 있습니다. 다시 확인해주세요.</div>
										}
										<Button type='submit' onClick={() => {
											setTouched(true)
											if(!isValid) window.scrollTo({ top: 0 })
										} }>
											<>
												<i className='far fa-paper-plane'/> 등록
											</>
										</Button>
									</>
								}
							</Form>
						)}
					</Formik>
						: <Forbidden />
		}
	</Container>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token)
	const server = await get.server.load(ctx.query.id as string) || null
	const serverData = await get.serverData(ctx.query.id as string) || null
	return { props: {
		logged: !!user, user: await get.user.load(user || ''),
		csrfToken: getToken(ctx.req, ctx.res),
		server,
		serverData
	} }
}

interface AddServerProps {
	logged: boolean
	user: User
	csrfToken: string
	server: Server | null
	serverData: ServerData | null
	theme: Theme
}

export default AddServer