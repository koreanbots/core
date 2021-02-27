import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import useCopyClipboard from 'react-use-clipboard'

import { get } from '@utils/Query'
import { parseCookie } from '@utils/Tools'

import { ParsedUrlQuery } from 'querystring'
import { Bot, BotSpec, User } from '@types'
import NotFound from 'pages/404'
import { Form, Formik } from 'formik'
import { DeveloperBotSchema } from '@utils/Yup'

const Button = dynamic(() => import('@components/Button'))
const Input = dynamic(() => import('@components/Form/Input'))
const DeveloperLayout = dynamic(() => import('@components/DeveloperLayout'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))

const BotApplication: NextPage<BotApplicationProps> = ({ spec, bot }) => {
	const [ showToken, setShowToken ] = useState(false)
	const [ tokenCopied, setTokenCopied ] = useCopyClipboard(spec?.token, {
		successDuration: 1000
	})

	if(!bot || !spec) return <NotFound />
	return <DeveloperLayout enabled='applications'>
		<h1 className='text-3xl font-bold'>봇 설정</h1>
		<p className='text-gray-400'>한국 디스코드봇 리스트 API를 사용해보세요.</p>
		<div className='lg:flex pt-6'>
			<div className='w-1/5'>
				<DiscordAvatar userID={bot.id} />
			</div>
			<div className='w-4/5 relative'>
				<h2 className='text-2xl font-bold'>{bot.name}</h2>
				<div className='grid text-left'>
					<h3 className='text-lg font-semibold'>봇 토큰</h3>
					<pre className='text-sm overflow-x-scroll w-full'>{showToken ? spec.token : '*********'}</pre>
					<div className='pt-3 pb-6'>
						<Button onClick={() => setShowToken(!showToken)}>{showToken ? '숨기기' : '보기'}</Button>
						<Button onClick={setTokenCopied} className={tokenCopied ? 'bg-green-400 text-white' : null}>{tokenCopied ? '복사됨' : '복사'}</Button>
						<Button>재발급</Button>
					</div>
					<Formik validationSchema={DeveloperBotSchema} initialValues={{
						webhook: spec.webhook || ''
					}}
					onSubmit={(d)=>console.log(d)}>
						{({ errors, touched }) => (
							<Form>
								<div className='mb-2'>
									<h3 className='font-bold mb-1'>웹훅 URL</h3>
									<p className='text-gray-400 text-sm mb-1'>웹훅을 이용하여 다양한 한국 디스코드봇 리스트의 봇에 발생하는 이벤트를 받아볼 수 있습니다.</p>
									<Input name='webhook' placeholder='https://webhook.kbots.link' />
									{touched.webhook && errors.webhook ? <div className='text-red-500 text-xs font-light mt-1'>{errors.webhook}</div> : null}
								</div>
								<Button type='submit'><i className='far fa-save'/> 저장</Button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	</DeveloperLayout>

}

interface BotApplicationProps {
  user: User
  spec: BotSpec
	bot: Bot
}

export const getServerSideProps = async (ctx: Context) => {
	const parsed = parseCookie(ctx.req)
	const user = await get.Authorization(parsed?.token) || ''
  
	return {
		props: { spec: await get.botSpec(ctx.query.id, user), bot: await get.bot.load(ctx.query.id) }
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