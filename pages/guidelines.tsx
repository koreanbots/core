import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Docs = dynamic(()=> import('@components/Docs'))

const Privacy: NextPage = () => {
	return (
		<Docs
			header='가이드라인'
			description='리스트에 등재되는 모든 봇들이 지켜야하는 가이드라인입니다!'
			subheader='최초 작성: 2020-04-30 수정: 2020-05-15'
		>
			<h1 className='mb-3 text-4xl font-bold'>KOREANBOTS에 오신 것을 환영합니다.</h1>
			<p>봇 추가 또는 등재 유지를 위해서 반드시 지켜야할 가이드라인들입니다.</p>
			<p>가이드라인 위반이 확인될 경우, 거부 또는 삭제 처리될 수 있음을 알려드립니다.</p>
			<h2 className='mt-10 text-3xl font-semibold' id='봇'>
				봇
			</h2>
			<p>아래는 봇 추가를 위해 반드시 지켜야할 규칙입니다.</p>
			<ul className='list-inside list-disc'>
				<li>반드시 디스코드 서버에 참가해주세요.</li>
				<li>카테고리는 정확하게 지정해주세요 (NSFW의 경우 반드시 NSFW를 지정해주셔야합니다.)</li>
				<li>
					오픈소스가 베이스가 되는 봇(유사한 점이 인정되는 경우는 설명란에 해당 오픈소스를
					기재해주세요)
				</li>
				<li>
					100퍼센트 업타임을 유지할 필요는 없지만, 심사 시간 기준으로 오프라인일 경우 심사
					거부됩니다.
				</li>
				<li>한국인 개발자가 개발하였으며, 한국어를 지원</li>
				<li>서버로 초대할 수 있는 공개봇 (특수목적의 봇은 제외)</li>
				<li>
					오픈소스봇을 따로 거부하지는 않지만, 반드시 <strong>라이선스</strong>를 지켜주세요.
					원작자가 문제 제기할 경우, 통보없이 봇이 삭제되거나 거부될 수 있습니다.
					<ul className='pl-3 list-inside list-disc'>
						<li>
							오픈소스 라이선스에 <strong>원소스를 표시해야 한다는 조항</strong>(MIT 등 해당)이
							있다면, 소스같은 곳뿐만 아니라 반드시 봇 설명에 기재해주세요.
						</li>
						<li>
							한 두개의 명령어까지 관여할 수는 없지만, 봇의 베이스 소스(예시: Just Some Bot을 활용한
							뮤직봇, RedBot 기반 봇.)에
							<br />
							오픈소스가 사용되었을 경우, 반드시 라이선스에 관한 조항을 봇 설명에 표시해주세요.
						</li>
					</ul>
				</li>
			</ul>
			<h3 className='mt-x text-lg font-semibold' id='금지사항'>
				금지사항
			</h3>
			<p>다음 항목에 해당하는 봇의 등록을 거부할 수 있습니다.</p>
			<ul className='list-inside list-disc'>
				<li>불법 프로그램 홍보 또는 판매 기타 행위를 조장하는 봇.</li>
				<li>
					디스코드 <strong>TOS</strong>나 <strong>가이드라인</strong>, <strong>개발자 약관</strong>
					에 위반되는 봇.
				</li>
				<li>
					서버 테러를 시도하거나, 무단으로 의도하여 채널,역할 등을 삭제/수정을 시도 또는 이력이
					존재하는 경우
				</li>
				<li>대한민국 법을 위반하거나 오픈소스 라이선스, API 라이선스등을 위반한 봇</li>
			</ul>
			<h2 className='mt-10 text-3xl font-semibold' id='유저'>
				유저
			</h2>
			<p>
				다음 항목에 해당하는 유저가 제작에 참여하고 있는(과거에 제작 참여 이력과는 관련 없음) 봇의
				등록을 거부할 수 있습니다.
			</p>
			<ul className='list-inside list-disc'>
				<li>
					디스코드 <strong>TOS</strong>나 <strong>가이드라인</strong>, <strong>개발자 약관</strong>{' '}
					또는 <strong>대한민국 법</strong>, <strong>오픈소스 라이선스</strong>,{' '}
					<strong>기타 라이선스</strong> 중 하나 이상을 위반 하고 있는 경우
				</li>
			</ul>
			<p className='mt-10'>
				위 항목들은 정확하게 인정되기 전까지는 처리할 수 없습니다. 또한, 처리하기 전에는 반드시
				유저에게 통보를 시도해야합니다.
			</p>
			<p>
				당사의 가이드라인은 <strong>대한민국 국내법</strong>이 상위 적용됩니다.
			</p>
		</Docs>
	)
}

export default Privacy
