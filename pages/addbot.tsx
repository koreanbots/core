import { NextPage, NextPageContext } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Form, Formik } from 'formik'

import { get } from '@utils/Query'
import { parseCookie, redirectTo } from '@utils/Tools'
import { AddBotSubmit, AddBotSubmitSchema } from '@utils/Yup'
import { categories, library } from '@utils/Constants'
import { ResponseProps, SubmittedBot, User } from '@types'
import { getToken } from '@utils/Csrf'
import Fetch from '@utils/Fetch'

const CheckBox = dynamic(() => import('@components/Form/CheckBox'))
const Label = dynamic(() => import('@components/Form/Label'))
const Input = dynamic(() => import('@components/Form/Input'))
const Divider = dynamic(() => import('@components/Divider'))
const TextArea = dynamic(() => import('@components/Form/TextArea'))
const Segment = dynamic(() => import('@components/Segment'))
const Markdown = dynamic(() => import('@components/Markdown'))
const Select = dynamic(() => import('@components/Form/Select'))
const Selects = dynamic(() => import('@components/Form/Selects'))
const Button = dynamic(() => import('@components/Button'))
const Container = dynamic(() => import('@components/Container'))
const Message = dynamic(() => import('@components/Message'))
const SEO = dynamic(() => import('@components/SEO'))

const AddBot:NextPage<AddBotProps> = ({ logged, user, csrfToken }) => {
	const [ data, setData ] = useState<ResponseProps<SubmittedBot>>(null)
	const router = useRouter()
	function toLogin() {
		localStorage.redirectTo = window.location.href
		redirectTo(router, 'login')
	}

	async function submitBot(value: AddBotSubmit) {
		const res = await Fetch<SubmittedBot>(`/bots/${value.id}`, { method: 'POST', body: JSON.stringify(value), headers: { 'content-type': 'application/json' } })
		setData(res)
	}
	if(!logged) {
		toLogin()
		return <SEO title='새로운 봇 추가하기' description='자신의 봇을 한국 디스코드봇 리스트에 등록하세요.'/>
	}
	return <Container paddingTop className='pt-5'>
		<SEO title='새로운 봇 추가하기' description='자신의 봇을 한국 디스코드봇 리스트에 등록하세요.'/>
		<h1 className='text-3xl font-bold'>새로운 봇 추가하기</h1>
		<div className='mt-1 mb-5'>
			안녕하세요, <span className='font-semibold'>{user.username}#{user.tag}</span>님! <a role='button' tabIndex={0} onKeyDown={toLogin} onClick={toLogin} className='text-discord-blurple cursor-pointer outline-none'>본인이 아니신가요?</a>
		</div>
		{
			data ? data.code == 200 && data.data ? <Message type='success'>
				<h2 className='text-lg font-black'>봇 신청 성공!</h2>
				<p>봇을 성공적으로 신청했습니다! 심사 페이지로 리다이랙트됩니다. {redirectTo(router, `/pendingBots/${data.data.id}/${data.data.date}`)}</p>
			</Message> : <Message type='error'>
				<h2 className='text-lg font-black'>{data.message || '오류가 발생했습니다.'}</h2>
				<ul className='list-disc list-inside'>
					{data.errors?.map((el, n) => <li key={n}>{el}</li>)}
				</ul>
				
			</Message> : <></>
		}
		<Formik initialValues={{
			agree: false,
			id: '',
			prefix: '',
			library: '',
			category: [],
			intro: '',
			desc: `<!-- 이 설명을 지우시고 원하시는 설명을 적으셔도 좋습니다! -->
# 봇이름
자신의 봇을 자유롭게 표현해보세요!

## ✏️ 소개

무엇이 목적인 봇인가요?

## 🛠️ 기능

- 어떤
- 기능
- 있나요?`,
			_csrf: csrfToken
		}}
		validationSchema={AddBotSubmitSchema}
		onSubmit={submitBot}>
			{({ errors, touched, values, setFieldTouched, setFieldValue }) => (
				<Form>
					<div className='py-3'>
						<Message type='warning'>
							<h2 className='text-lg font-black'>신청하시기 전에 다음 사항을 확인해 주세요!</h2>
							<ul className='list-disc list-inside'>
								<li><Link href='/discord'><a className='text-blue-500 hover:text-blue-600'>디스코드 서버</a></Link>에 참가하셨나요?</li>
								<li>봇이 <Link href='/guidelines'><a className='text-blue-500 hover:text-blue-600'>가이드라인</a></Link>을 지키고 있나요?</li>
								<li>봇 소유자가 두 명 이상인가요? 봇 소유자는 봇이 승인된 뒤, 더 추가하실 수 있습니다.</li>
								<li>본인이 봇의 소유자라는 것을 증명할 수 있나요? 본인이 봇 소유자임을 증명하려면, 태그가 포함되어야 합니다.</li>
				다음 명령어(접두사로 시작하는) 중 하나 이상에 소유자를 표시하셔야 합니다.

								<ul>
									<li>- 도움 명령어: 도움, 도움말, 명령어, help, commands</li>
									<li>- 도움 명령어에 소유자임을 나타내고 싶지 않으시다면, 아래 명령어를 만들어주세요<br/>
						명령어: [접두사]hellothisisverification 응답: 유저#태그(아이디)</li>
								</ul>
								<li>또한, 봇을 등록하게 되면 작성하신 모든 정보는 웹과 API에 공개됩니다.</li>
							</ul>
						</Message>
					</div>
					<Label For='agree' error={errors.agree && touched.agree ? errors.agree : null} grid={false}>
						<div className='flex items-center'>
							<CheckBox name='agree' />
							<strong className='text-sm'>해당 내용을 숙지하였으며, 모두 이행하였고 위 내용에 해당하는 거부 사유는 답변받지 않는다는 점을 이해합니다.</strong>
						</div>
					</Label>
					<Divider />

					<Label For='id' label='봇 ID' labelDesc='봇의 클라이언트 ID를 의미합니다.' error={errors.id && touched.id ? errors.id : null} short required>
						<Input name='id' placeholder='653534001742741552' />
					</Label>
					<Label For='prefix' label='접두사' labelDesc='봇의 사용시 앞 쪽에 붙은 기호를 의미합니다. (Prefix)' error={errors.prefix && touched.prefix ? errors.prefix : null} short required>
						<Input name='prefix' placeholder='!' />
					</Label>
					<Label For='library' label='라이브러리' labelDesc='봇에 사용된 라이브러리를 선택해주세요. 해당되는 라이브러리가 없다면 기타를 선택해주세요.' short required error={errors.library && touched.library ? errors.library : null}>
						<Select options={library.map(el=> ({ label: el, value: el }))} handleChange={(value) => setFieldValue('library', value.value)} handleTouch={() => setFieldTouched('library', true)} />
					</Label>
					<Label For='category' label='카테고리' labelDesc='봇에 해당되는 카테고리를 선택해주세요' required error={errors.category && touched.category ? errors.category as string : null}>
						<Selects options={categories.map(el=> ({ label: el, value: el }))} handleChange={(value) => {
							setFieldValue('category', value.map(v=> v.value))
						}} handleTouch={() => setFieldTouched('category', true)} values={values.category as string[]} setValues={(value) => setFieldValue('category', value)} />
						<span className='text-gray-400 mt-1 text-sm'>봇 카드에는 앞 3개의 카테고리만 표시됩니다. 드래그하여 카테고리를 정렬하세요.</span>
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
					</Label>
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
						<TextArea name='desc' placeholder='봇에 대해 최대한 자세히 설명해주세요!' />
					</Label>
					<Label For='preview' label='설명 미리보기' labelDesc='다음 결과는 실제와 다를 수 있습니다'>
						<Segment>
							<Markdown text={values.desc} />
						</Segment>
					</Label>
					<Divider />
					<Button type='submit' onClick={() => window.scrollTo({ top: 0 })}>
						<>
							<i className='far fa-paper-plane'/> 제출
						</>
					</Button>
				</Form>
			)}
		</Formik>
	</Container>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token)
	return { props: { logged: !!user, user: await get.user.load(user || ''), csrfToken: getToken(ctx.req, ctx.res) } }
}

interface AddBotProps {
	logged: boolean
	user: User
	csrfToken: string
}

export default AddBot