import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { User } from '@types'
import { BUG_REPORTERS } from '@utils/Constants'
import { get } from '@utils/Query'

const Docs = dynamic(() => import('@components/Docs'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const Button = dynamic(() => import('@components/Button'))

const Security: NextPage<SecurityProps> = ({ bugReports }) => {
	return <Docs
		header='버그 바운티 프로그램'
		description='한국 디스코드봇 리스트는 보안을 최우선으로 생각합니다.'
	>
		<h1 className='mb-3 text-3xl font-bold text-koreanbots-blue'>소개</h1>
		<p>한국 디스코드봇 리스트는 보안을 우선으로 생각합니다. 보안 버그 제보를 장려하기위해 보안 관련 취약점을 제보해주신 분께 소정의 보상을 지급해드립니다.</p>
		<h1 className='mt-6 mb-3 text-3xl font-bold text-koreanbots-blue'>규칙</h1>
		<ul className='list-disc list-inside'>
			<li>자신이 소유하고 있는 계정과 봇에서만 테스트해야합니다. 절대로 다른 유저에게 영향을 주어서는 안됩니다.</li>
			<li>한국 디스코드봇 리스트의 서비스에 피해를 끼치는 활동을 해서는 안됩니다. 예) 무차별 대입, DDoS, DoS 등</li>
			<li>취약점을 찾기 위해 스캐너와 같은 자동화 도구는 사용하지 마세요.</li>
			<li>발견한 문제에 대한 모든 정보는 보안팀이 완벽하게 조사하고 해결하기 전까지는 절대로 제3자에게 공개/공유해서는 안됩니다.</li>
			<li>한국 디스코드봇 리스트는 제보된 문제에 관한 모든 정보를 공개할 권한을 가집니다.</li>
		</ul>
		<h1 className='mt-6 mb-3 text-3xl font-bold text-koreanbots-blue'>범위</h1>
		<ul className='list-disc list-inside'>
			{
				['koreanbots.dev 및 *.koreanbots.dev', 'kbots.link', '디스코드.한국'].map(el => <li key={el}>{el}</li>)
			}
		</ul>
		<h1 className='mt-6 mb-3 text-3xl font-bold text-koreanbots-blue'>취약점에 포함되지 않는 사항</h1>
		<ul className='list-disc list-inside'>
			<li>이미 한국 디스코드봇 리스트 내부에서 해당 취약점을 인지하고 있는 경우</li>
			<li>Brute force 공격</li>
			<li>Clickjacking</li>
			<li>DoS 공격</li>
			<li>본인에게만 영향이 미치는 취약점(Self XSS 등)</li>
		</ul>
		<h1 className='mt-6 mb-3 text-3xl font-bold text-koreanbots-blue'>취약점을 제보해주신 분들</h1>
		<div className='flex flex-wrap'>
			{
				bugReports.filter(el=>el).map(u => <div key={u.id} className='flex items-center mr-2.5'>
					<DiscordAvatar userID={u.id} size={128} className='rounded-full w-6 h-6 mr-1' />
					<span className='text-base dark:text-gray-300'>{u.username}#{u.tag}</span>
				</div>)
			}
		</div>
		<div className='text-center py-36'>
			<h1 className='text-3xl font-bold mb-6'>취약점을 발견하셨나요?</h1>
			<Button href='mailto:koreanbots.dev@gmail.com'>제보하기</Button>
		</div>
	</Docs>
}

export const getServerSideProps: GetServerSideProps<SecurityProps> = async () => {
	return {
		props: {
			bugReports: await Promise.all(BUG_REPORTERS.map(u => get.user.load(u)))
		}
	}
}

export default Security

interface SecurityProps {
  bugReports: User[]
}