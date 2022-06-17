import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Button = dynamic(() => import('@components/Button'))
const Divider = dynamic(() => import('@components/Divider'))
const Docs = dynamic(()=> import('@components/Docs'))

const Verification: NextPage = () => {
	return (
		<Docs
			header='인증'
			description='한국 디스코드 리스트의 신뢰된 봇은 디스코드 인증보다 더 자세한 기준으로 신뢰성을 주기 위한 제도입니다.'
		>
			<h1 className='mb-3 text-4xl font-bold'>
				<span className='text-koreanbots-blue mr-5'>
					<i className='fas fa-award' />
				</span>신뢰된 봇</h1>
			<p>한국 디스코드 리스트의 신뢰된 봇은 디스코드 인증보다 더 자세한 기준으로 신뢰성을 주기 위한 제도입니다.</p>
			<h2 className='mt-10 text-3xl font-semibold' id='기준'>
				기준
			</h2>
			<p>신뢰할 수 있는 봇임을 증명하려면 아래의 기준에 모두 해당해야 합니다.</p>
			<ul className='list-inside list-disc'>
				<li>5000개 이상의 서버</li>
				<li>
					유저가 공식적인 지원 통로(웹사이트, 티켓 채널 등)를 통해 문의할 수 있는 방법이 존재
				</li>
				<li>
					수집하는 개인정보, 이용범위, 제 3자 위탁 업체를 유저가 접근 가능한 약관에 명시
				</li>
				<li>
					평균 95퍼센트 이상의 업타임
				</li>
				<li>안전하고 신뢰할 수 있는 개인 정보 같은 데이터의 저장 방식</li>
				<li>디스코드에게 인증된 봇</li>
			</ul>
			<p>혹은 아래 기준 중 하나 이상에 해당해야 합니다.</p>
			<ul className='list-inside list-disc'>
				<li>디스코드 인증과 파트너쉽이 체결된 봇</li>
				<li>당사가 인정한 특수 목적의 봇</li>
			</ul>
			<h2 className='mt-10 text-3xl font-semibold' id='혜택'>혜택</h2>
			<p>신뢰된 봇은 다음 혜택을 가집니다.</p>
			<ul className='list-inside list-disc'>
				<li>봇의 전용 고유 URL, 배너와 배경 커스터마이징</li>
				<li>당사에 직접적으로 연락할 수 있는 창구</li>
				<li>신규 기능 미리 공개</li>
			</ul>
			<h2 className='mt-10 text-3xl font-semibold' id='책임'>책임</h2>
			<ul className='list-inside list-disc'>
				<li>인증된 봇임에도 불구하고 봇 또는 봇의 개발자가 사회적 또는 도의적 물의를 일으킬 경우 인증된 봇 자격 박탈 외에는 어떠한 보증과 책임을 일체 부인합니다.</li>
			</ul>
			<h2 className='mt-10 text-3xl font-semibold' id='기타'>기타</h2>
			<ul className='list-inside list-disc'>
				<li>당사는 가이드라인 및 이용자들에게 물의를 일으켜 봇에 대한 신뢰성에 심각한 타격을 줄 경우 신뢰된 봇 자격을 박탈할 권한을 갖습니다.</li>
				<li>신뢰된 봇 인증 이후에 지속적으로 기준에 미달하는 경우 당사는 신뢰된 봇 자격을 박탈할 권한을 갖습니다.</li>
				<li>당사는 공개된 조건 이외에 봇에 대한 신뢰성을 보장할 수 있는지 대한 내부 심사를 통해 승인 여부를 결정합니다.</li>
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
