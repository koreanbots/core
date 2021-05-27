import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Button = dynamic(() => import('@components/Button'))
const Divider = dynamic(() => import('@components/Divider'))
const Docs = dynamic(()=> import('@components/Docs'))

const Verification: NextPage = () => {
	return (
		<Docs
			header='인증'
			description='한국 디스코드봇 리스트의 신뢰된 봇은 디스코드 인증보다 더 자세한 기준으로 신뢰성을 주기 위한 제도입니다.'
		>
			<h1 className='mb-3 text-4xl font-bold'>
				<span className='text-koreanbots-blue mr-5'>
					<i className='fas fa-award' />
				</span>신뢰된 봇</h1>
			<p>한국 디스코드봇 리스트의 신뢰된 봇은 디스코드 인증보다 더 자세한 기준으로 신뢰성을 주기 위한 제도입니다.</p>
			<h2 className='mt-10 text-3xl font-semibold' id='기준'>
				기준
			</h2>
			<p>신뢰할 수 있는 봇임을 증명하려면 아래의 기준에 모두 해당해야합니다.</p>
			<ul className='list-inside list-disc'>
				<li>1000개 이상의 서버</li>
				<li>
					10만명 이상의 중복 유저 혹은 5000명 이상의 가입유저
				</li>
				<li>
					유저가 지원받을 수 있는 방법이 존재
				</li>
				<li>
					집하는 개인정보와 이용범위를 서비스에 명시
				</li>
				<li>평균 90퍼센트 이상의 업타임</li>
				<li>안전하고 신뢰할 수 있는 저장방식</li>
				<li>
					대표 메인 콘텐츠가 존재해야합니다. (다양한 기능이 있어도 되지만, 하나의 메인 기능이 필요합니다. ex. 관리, 밈 등등)
				</li>
				<li>디스코드 인증된 봇</li>
			</ul>
			<p>혹은 아래 기준 중 하나 이상에 해당해야합니다.</p>
			<ul className='list-inside list-disc'>
				<li>디스코드 인증과 파트너쉽이 체결된 봇.</li>
				<li>당사가 인정한 특수 목적의 봇.</li>
				<li>같은 이름의 봇이 있어 혼동을 줄 수 있는 경우.</li>
			</ul>
			<h2 className='mt-10 text-3xl font-semibold' id='혜택'>혜택</h2>
			<ul className='list-inside list-disc'>
				<li>봇 페이지 커스텀 URL</li>
				<li>뱃지</li>
				<li>미리보기 배경</li>
				<li>프로필 배경 커스텀마이징</li>
			</ul>
			<Divider />
			<div className='text-center pt-10'>
				<h2 className='text-2xl font-bold mb-6'>지금 바로 신청하세요</h2>
				<Button href='https://github.com/koreanbots/verification'><i className='fab fa-github' /> 신청하기</Button>
			</div>
		</Docs>
	)
}

export default Verification
