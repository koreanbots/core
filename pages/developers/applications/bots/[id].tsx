/* eslint-disable no-mixed-spaces-and-tabs */
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
import { Bot, BotSpec, ResponseProps, Theme, WebhookStatus } from '@types'

import NotFound from 'pages/404'
import Link from 'next/link'
import { Form, Formik } from 'formik'
import { DeveloperBot, DeveloperBotSchema } from '@utils/Yup'
import Input from '@components/Form/Input'
import Tooltip from '@components/Tooltip'

const Button = dynamic(() => import('@components/Button'))
const Divider = dynamic(() => import('@components/Divider'))
const DeveloperLayout = dynamic(() => import('@components/DeveloperLayout'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const Message = dynamic(() => import('@components/Message'))
const Modal = dynamic(() => import('@components/Modal'))
const StatisticsCard = dynamic(() => import('@components/StatisticsCard'))
const Select = dynamic(() => import('@components/Form/Select'))
const DateSelect = dynamic(() => import('@components/Form/DateSelect'))

const BotApplication: NextPage<BotApplicationProps> = ({ user, spec, bot, theme, csrfToken }) => {
	const router = useRouter()
	const [ data, setData ] = useState<ResponseProps<unknown>>(null)
	const [ modalOpened, setModalOpen ] = useState(false)
	const [ showToken, setShowToken ] = useState(false)
	const [ range, setRange ] = useState('day')
	const [ startDate, setStartDate ] = useState(new Date())
	const [ endDate, setEndDate ] = useState(new Date())
	const [ tokenCopied, setTokenCopied ] = useClipboard(spec?.token, {
		successDuration: 1000
	})
	const availableRanges = [
		{
			label: '일간',
			value: 'day'
		},
		{
			label: '주간',
			value: 'week'
		},
		{
			label: '월간',
			value: 'month'
		},
	]
	async function updateApplication(d: DeveloperBot) {
		const res = await Fetch(`/applications/bots/${bot.id}`, {
	 		method: 'PATCH',
	 		body: JSON.stringify(cleanObject(d))
	 	})
	 	setData(res)
	 }

	async function resetToken() {
		const res = await Fetch<{ token: string }>(`/applications/bots/${bot.id}/reset`, {
			method: 'POST',
			body: JSON.stringify({ token: spec.token, _csrf: csrfToken })
		})
		setData(res)

		return res
	}

	if(!user) {
		localStorage.redirectTo = window.location.href
		redirectTo(router, 'login')
		return
	}
	if(!bot || !spec) return <NotFound />
	return <DeveloperLayout enabled='applications'>
		<Link href='/developers/applications'>
			<a className='text-blue-500 hover:text-blue-400'>
				<i className='fas fa-arrow-left' /> 돌아가기
			</a>
		</Link>
		<h1 className='text-3xl font-bold'>봇 설정</h1>
		<p className='text-gray-400'>한국 디스코드 리스트 API에 사용할 정보를 이곳에서 설정하실 수 있습니다.</p>
		<div className='lg:flex py-6'>
			<div className='lg:w-1/5'>
				<DiscordAvatar userID={bot.id} />
			</div>
			<div className='lg:w-4/5 relative'>
				<div className='mt-4'>
					{
						!data ? '' : data.code === 200 ? 
							<Message type='success'>
								<h2 className='text-lg font-extrabold'>수정 성공!</h2>
								<p>봇 정보를 저장했습니다.</p>
							</Message> : <Message type='error'>
								<h2 className='text-lg font-extrabold'>{data.message}</h2>
								<ul className='list-disc list-inside'>
									{
										data.errors?.map((el, i)=> <li key={i}>{el}</li>)
									}
								</ul>
							</Message>
					}
				</div>
				<div className='grid text-left px-6'>
					<h2 className='text-3xl font-bold mb-2 mt-3'>{bot.name}#{bot.tag}</h2>
					<h3 className='text-lg font-semibold'>봇 토큰</h3>
					<pre className='text-sm overflow-x-scroll w-full'>{showToken ? spec.token : '******************'}</pre>
					<div className='pt-3 pb-6'>
						<Button onClick={() => setShowToken(!showToken)}>{showToken ? '숨기기' : '보기'}</Button>
						<Button onClick={setTokenCopied} className={tokenCopied ? 'bg-emerald-400 text-white' : null}>{tokenCopied ? '복사됨' : '복사'}</Button>
						<Button onClick={()=> setModalOpen(true)}>재발급</Button>
						<Modal isOpen={modalOpened} onClose={() => setModalOpen(false)} dark={theme === 'dark'} header='정말로 토큰을 재발급하시겠습니까?'>
							<p>기존에 사용중이시던 토큰은 더 이상 사용하실 수 없습니다</p>
							<div className='text-right pt-6'>
								<Button className='bg-gray-500 text-white hover:opacity-90' onClick={()=> setModalOpen(false)}>취소</Button>
								<Button onClick={async ()=> {
									const res = await resetToken()
									spec.token = res.data.token
									setModalOpen(false)
								}}>재발급</Button>
							</div>
						</Modal>
					</div>
					<Formik validationSchema={DeveloperBotSchema} initialValues={{
						webhookURL: spec.webhookURL || '',
						_csrf: csrfToken
					}}
					onSubmit={updateApplication}>
						{({ errors, touched }) => (
							<Form>
								<div className='mb-2'>
									<h3 className='font-bold mb-1'>
										웹훅 URL
										{(!data || data.code !== 200) && spec.webhookStatus === WebhookStatus.Disabled && (
											<Tooltip direction='left' text='웹훅 링크가 유효하지 않아 웹훅이 중지되었습니다.'>
												<span className='text-red-500 text-base font-semibold pl-1' role='img' aria-label='warning'>⚠️</span>
											</Tooltip>
										)}
									</h3>
									<p className='text-gray-400 text-sm mb-1'>웹훅을 이용하여 다양한 한국 디스코드 리스트의 봇에 발생하는 이벤트를 받아볼 수 있습니다.<br/>
									웹훅 링크가 유효하지 않을 경우 웹훅이 중지되며, 다시 저장할 경우 다시 활성화됩니다.<br/>
									웹훅에 대한 자세한 내용은 <Link href={'/developers/docs/%EC%9B%B9%ED%9B%84%ED%81%AC'}><a className='text-blue-500 hover:text-blue-400 font-semibold'>개발자 문서</a></Link>에서 확인하실 수 있습니다.
									</p>
									<Input name='webhookURL' placeholder='https://webhook.koreanbots.dev' />
									{touched.webhookURL && errors.webhookURL ? <div className='text-red-500 text-xs font-light mt-1'>{errors.webhookURL}</div> : null}
								</div>
								<Button type='submit'><i className='far fa-save'/> 저장</Button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
		<Divider />
		<h1 className='text-3xl font-bold pt-6'>봇 통계</h1>
		<div className='flex flex-row pt-2 items-center'>
			<div className='w-20 mr-2'>
				<Select options={availableRanges} handleChange={(option) => setRange(option.value)} value={availableRanges[0]} handleTouch={() => null} />
			</div>
			<DateSelect selected={startDate} onChange={(date) => setStartDate(date)} startDate={startDate} endDate={endDate} />
			<p className='px-2 text-gray-400 text-xl font-semibold'>
				부터
			</p>
			<DateSelect selected={endDate} onChange={(date) => setEndDate(date)} startDate={startDate} endDate={endDate} minDate={startDate} />
			<p className='px-2 text-gray-400 text-xl font-semibold'>
				까지
			</p>
		</div>
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-3 gap-5'>
			<StatisticsCard name='하트 수' currentValue={50} diff={10} icon={<i className='fas fa-heart text-red-600 self-center text-xl mr-1' />} range={range} />
			<StatisticsCard name='서버 수' currentValue={1000} diff={-10} icon={<i className='fas fa-users text-discord-blurple self-center text-xl mr-2' />} range={range} />
			<StatisticsCard name='조회수' currentValue={102} diff={0} icon={<i className='fas fa-mouse-pointer text-neutral-200 self-center text-lg -mr-1' />} range={range} />
			<StatisticsCard name='초대 클릭 수' currentValue={5} diff={3} icon={<i className='fas fa-user-plus text-discord-old-blurple self-center text-xl mr-2.5' />} range={range} />
		</div>
	</DeveloperLayout>

}

interface BotApplicationProps {
  user: string
  spec: BotSpec
	bot: Bot
	csrfToken: string
	theme: Theme
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token) || ''
  
	return {
		props: { user, spec: await get.botSpec(ctx.query.id, user), bot: await get.bot.load(ctx.query.id), csrfToken: getToken(ctx.req, ctx.res) }
	}
}

interface Context extends NextPageContext {
  query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
  id: string
  date: string
}

export default BotApplication