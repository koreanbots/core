import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { get } from '@utils/Query'
import { BotSubmissionDenyReasonPresetsName, git } from '@utils/Constants'
import Day from '@utils/Day'

import { SubmittedBot, User } from '@types'

import useCopyClipboard from 'react-use-clipboard'
import { ParsedUrlQuery } from 'querystring'

import NotFound from 'pages/404'

const Container = dynamic(() => import('@components/Container'))
const Divider = dynamic(() => import('@components/Divider'))
const LongButton = dynamic(() => import('@components/LongButton'))
const Tag = dynamic(() => import('@components/Tag'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Segment = dynamic(() => import('@components/Segment'))
const Markdown = dynamic(() => import ('@components/Markdown'))
const Owner = dynamic(() => import('@components/Owner'))
const Message = dynamic(() => import('@components/Message'))

const PendingBot: NextPage<PendingBotProps> = ({ data }) => {
	const [ isCopied, setCopied ] = useCopyClipboard(data?.desc, {
		successDuration: 1000
	})
	if(!data) return <NotFound />
	return <Container paddingTop className='py-10'>
		<NextSeo title='심사이력' />
		<div className='lg:flex w-full'>
			<div className='w-full lg:w-3/4 lg:pr-5 py-8 text-center lg:text-left'>
				{
					data.state === 0 ? <Message type='info'>
						<h2 className='text-lg font-black'>승인 대기중</h2>
						<p>해당 봇은 아직 승인 대기 상태입니다.</p>
						
					</Message> 
						: data.state === 1 ? <Message type='success'>
							<h2 className='text-lg font-black'>승인됨</h2>
							<p>신청하신 해당 봇이 승인되었습니다!</p>
							<p><Link href={`/bots/${data.id}`}><a className='text-blue-500 hover:text-blue-400'>봇 페이지</a></Link></p>
						</Message> : <Message type='error'>
							<h2 className='text-lg font-black'>거부됨</h2>
							<p>아쉽게도 신청하신 해당 봇은 거부되었습니다.</p>
							{
								data.reason && <>
									<p>사유: <strong>{BotSubmissionDenyReasonPresetsName[data.reason] || data.reason}</strong></p>
									<div className='pt-2'>
										{DenyPresetsArticle[data.reason]}
									</div>
								</>
							}
						</Message>
				}
				<p className='dark:text-gray-300 text-gray-800 text-base mt-3'>{data.intro}</p>
			</div>
			<div className='w-full lg:w-1/4 lg:pt-8'>
				<LongButton
					newTab
					href={
						data.url ??
							`https://discordapp.com/oauth2/authorize?client_id=${data.id}&scope=bot&permissions=0`
					}
				>
					<h4 className='whitespace-nowrap'>
						<i className='fas fa-user-plus text-discord-blurple' /> 초대하기
					</h4>
				</LongButton>
				<LongButton onClick={setCopied}>
					<h4>
						{ isCopied ? <><i className='fas fa-check text-green-400' /> 복사됨</> : <><i className='far fa-copy'/> 설명 마크다운 복사하기</>}
					</h4>
				</LongButton>
			</div>
			
			
		</div>
		<Divider className='px-5' />
		<div className='lg:flex lg:flex-row-reverse'>
			<div className='mb-1 w-full lg:w-1/4'>
				<h2 className='3xl mb-2 font-bold'>정보</h2>
				<div className='grid gap-4 grid-cols-1 px-4 py-4 text-black dark:text-gray-400 dark:bg-discord-black bg-little-white rounded-sm'>
					<div className='flex'>
						<div className='w-2/5'>
							<i className='fas fa-fingerprint' /> ID
						</div>
						<div className='text-black dark:text-gray-400 truncate'>
							{data.id}
						</div>
					</div>
					<div className='flex'>
						<div className='w-2/5'>
							<i className='fas fa-calendar-day' /> 등록일
						</div>
						<div className='text-black dark:text-gray-400'>
							{Day(data.date * 1000).format('LLL')}
						</div>
					</div>
					<div className='flex'>
						<div className='w-2/5'>
							<i className='far fa-flag' /> 접두사
						</div>
						<div className='markdown-body text-black dark:text-gray-400'>
							<code>{data.prefix}</code>
						</div>
					</div>
				</div>
				<h2 className='3xl mb-2 mt-2 font-bold'>카테고리</h2>
				<div className='flex flex-wrap'>
					{data.category.map(el => (
						<Tag key={el} text={el} href={`/categories/${el}`} />
					))}
				</div>
				<h2 className='3xl mb-2 mt-2 font-bold'>제작자</h2>
				{(data.owners as User[]).map(el => (
					<Owner
						key={el.id}
						id={el.id}
						tag={el.tag}
						username={el.username}
					/>
				))}
				<div className='list grid'>
					{data.discord && (
						<a
							rel='noopener noreferrer'
							target='_blank'
							className='text-discord-blurple hover:underline'
							href={`https://discord.gg/${data.discord}`}
						>
							<i className='fab fa-discord' />
								디스코드 서버
						</a>
					)}
					{data.web && (
						<a
							rel='noopener noreferrer'
							target='_blank'
							className='text-blue-500 hover:underline'
							href={data.web}
						>
							<i className='fas fa-globe' />
								웹사이트
						</a>
					)}
					{data.git && (
						<a
							rel='noopener noreferrer'
							target='_blank'
							className='hover:underline'
							href={data.git}
						>
							<i className={`fab fa-${git?.[new URL(data.git).hostname].icon ?? 'git-alt'}`} />
							{git?.[new URL(data.git).hostname].text ?? 'Git'}
						</a>
					)}
				</div>
				<Advertisement size='tall' />
			</div>
			<div className='markdown-body pt-10 w-full lg:pr-5 lg:w-3/4'>
				<Advertisement />
				<Segment className='my-4'>
					<Markdown text={data.desc}/>
				</Segment>
				<Advertisement />
			</div>
		</div>
	</Container>
}

export const getServerSideProps = async (ctx: Context) => {
	const data = await get.botSubmit.load(JSON.stringify(ctx.query))
	return {
		props: {
			data
		}
	}
}

const DenyPresetsArticle = {
	MISSING_VERIFY: <>
		<p><strong>개발자 확인 불가</strong>로 거부되셨다면 본인이 봇의 소유자라는 것을 증명할 수 없다는 뜻입니다.</p>
		<p>본인이 봇 소유자임을 증명하려면, 개발자의 태그(username#0000 형식)가 반드시 다음 명령어중에 포함되어야합니다.
			<ul className='list-inside list-disc'>
				<li>도움 명령어: 도움, 도움말, 명령어, help, commands</li>
				<li>[접두사]hellothisisverification 응답: 유저#태그(아이디)</li>
			</ul>
		</p>
	</>,
	OFFLINE: <>
		<p><strong>봇 오프라인</strong>으로 거부되셨다면 심사 당시에 봇이 오프라인으로 명령어가 응답하지 않았다는 뜻입니다.</p>
		<p>봇이 24시간 호스팅 되지 않는다면, 아쉽게도 저희가 심사 시간을 맞춰드릴 수 없기에 심사 시간과 봇의 온라인 시간이 맞지 않는다면 심사를 진행할 수 없습니다.</p>
	</>,
	INVALID_CATEGORY:	<p>한 개 이상의 올바르지 않은 카테고리가 포함되어 있습니다. 반드시 <strong>봇에 해당되는</strong> 카테고리만 선택해주세요.</p>,
	PRIVATE: <p>봇을 초대할 수 없어, 심사를 진행할 수 없습니다. 다음 항목을 확인해주세요.
		<ul className='list-inside list-disc'>
			<li>봇이 공개 봇인가요?</li>
			<li>봇이 아직 인증을 받지 못하였는데 100서버에 도달하여 초대가 불가한가요?</li>
			<li>"REQUIRES OAUTH2 CODE GRANT" 옵션을 사용하고 있나요?</li>
			위 항목들을 해결하신 뒤에 다시 신청해주세요.
		</ul>
	</p>,
	LICENSE_VIOLATION: <p>한 건 이상의 오픈소스 라이선스 위반사항이 있습니다. 사용하신 오픈소스를 라이선스에 맞추어, 사이트 내 봇 설명과 봇 명령어 안에 기재해주세요.</p>,
	ABSENT_AT_DISCORD: <p>반드시 <a href='/discord'>공식 디스코드</a>에 참가해주세요.</p>
}

interface PendingBotProps {
  data: SubmittedBot
}

interface Context extends NextPageContext {
  query: URLQuery
}

interface URLQuery extends ParsedUrlQuery {
  id: string
  date: string
}

export default PendingBot