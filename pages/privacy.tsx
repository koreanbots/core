import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Docs = dynamic(()=> import('@components/Docs'))

const Privacy: NextPage = () => {
	return (
		<Docs header='개인정보취급방침' description='저희가 개인정보를 취급하는 방침입니다.'>
			<h2 className='mt-10 text-3xl font-medium'>개인정보 처리의 목적</h2>
			<p>
				"한국 디스코드봇 리스트"('https://koreanbots.dev')는 다음 목적을 위하여 개인정보를 처리하고
				있으며, 다음 목적 이외의 용도로는 사용하지 않습니다.
			</p>
			<ul className='list-inside list-disc'>
				<li>웹사이트에 표시 및 서비스 제공</li>
				<li>빠른 웹사이트 문제 수정</li>
				<li>사이트와 유저의 보안 유지</li>
			</ul>
			<h2 className='mt-10 text-3xl font-medium'>수집하는 개인정보 항목</h2>
			<ul className='list-inside list-disc'>
				<li>
					유저: 디스코드 Oauth를 통한 정보(이메일, 디스코드 유저의 ID, 아바타, 유저네임과 태그,
					접속해있는 길드), 접속로그(IP주소, 접속 기기정보), 유저의 봇 투표 정보 | 선택항목: Github
					닉네임
				</li>
				<li>
					봇: 등록일, ID, 이름, 태그, 디스코드 인증 여부, 소유자, 라이브러리, 접두사, 투표정보, 서버
					수, 봇 설명, 카테고리, 봇 Status | 선택항목: 웹사이트, GIT URL, 초대링크, 디스코드 서버
					링크
				</li>
			</ul>
			<h2 className='mt-10 text-3xl font-medium'>개인정보 보유 및 이용기간</h2>
			<p>
				개인정보는 <strong>서비스 종료시까지 보관을 원칙</strong>으로 하며, 유저의 요청시 언제든지
				파기할 수 있습니다.
			</p>
			<h2 className='mt-10 text-3xl font-medium'>이용자 및 법정 대리인의 권리와 행사 방법</h2>
			<p>
				회사는 정보통신망법 및 개인정보 보호법 등 관계 법령에서 규정하고 있는 이용자의 권리를 충실히
				보장합니다.
			</p>
			<p>
				이용자는 언제든지 자신의 개인정보 및 이용 현황을 상시 확인할 수 있으며, 동의 철회 및 정정을
				요청할 수 있습니다.
			</p>
			<h2 className='mt-10 text-3xl font-medium'>개인정보의 파기</h2>
			<p>
				개인정보의 수집 및 이용 목적이 달성 되면, 수집한 개인정보를 신속하고 안전한 방법으로
				파기합니다.
			</p>
			<h2 className='mt-10 text-3xl font-medium'>개인정보 보호책임자</h2>
			<p>
				권리 침해와 개인정보 처리와 관한 불만처리 및 피해구제를 위하여 아래와 같이 개인정보보호
				담당자를 지정하고 있습니다.
			</p>
			<h3>개인정보 보호 책임자</h3>
			<ul className='list-inside list-disc'>
				<li>성명: 박준서</li>
				<li>직책: 대표</li>
				<li>
					연락처: <a href='mailto:wonderlandpark@callisto.team'>메일</a> 혹은 디스코드
					@wonderlandpark#9999
				</li>
			</ul>
			<h2 className='mt-10 text-3xl font-medium'>개인정보 처리방침 변경 시 고지 의무</h2>
			<p>개인정보 처리방침의 변경이 있는 경우 시행 7일전 사전에 이용자에게 고지합니다.</p>
			<h2 className='mt-10 text-3xl font-medium'>정보주체의 권익침해에 대한 구제방법</h2>
			<p>정보주체는 아래의 기관에 개인정보 침해에 대한 피해구제, 상담 등을 문의할 수 있습니다.</p>
			<p>
				아래의 기관은 당사와는 별개의 기관으로서, 당사의 자체적인 개인정보 불만처리, 피해 구제
				결과에 만족하지 못하시거나 보다 자세한 도움이 필요하시면 문의하여 주시기 바랍니다.
			</p>
			<p>
				▶ 개인정보 침해신고센터 (행정안전부, 한국인터넷진흥원 운영)
				<br />
				- 소관업무 : 개인정보 침해사실 신고, 상담
				<br />
				- 인터넷 신고 : privacy.kisa.or.kr
				<br />
				- 전자우편 신고 : privacyclean@kisa.or.kr
				<br />
				- 전화 신고 : 118 (ARS 내선 2번)
				<br />
				- 팩스 신고 : ☎ 061-820-2619
				<br />
				- 방문/우편 신고 : (58324) 전라남도 나주시 진흥길 9(빛가람동 301-2) 3층 한국인터넷진흥원
				개인정보침해신고센터
				<br />
			</p>
			<p>
				▶ 개인정보 분쟁조정위원회
				<br />
				- 소관업무 : 개인정보 분쟁조정 및 집단 분쟁조정 신청, 상담
				<br />
				- 온라인 신청 : www.kopico.go.kr
				<br />
				- 오프라인(우편) 신청 : (03171) 서울특별시 종로구 세종대로 209 정부서울청사 4층
				개인정보분쟁조정위원회 (☎1833-6972)
				<br />
			</p>
			<p>
				▶ 대검찰청 과학수사부 사이버수사과
				<br />
				- 소관업무 : 각종 사이버범죄 수사/수사지원 전담
				<br />
				- 인터넷 신고 : cybercid@spo.go.kr
				<br />
				- 전화 : (국번없이) 1301, 02-3480-3570
				<br />
			</p>
			<p>
				▶ 경찰청 사이버안전국
				<br />
				- 소관업무 : 개인정보 침해 관련 사이버 범죄 신고, 상담
				<br />
				- 인터넷 신고 : cyberbureau.police.go.kr
				<br />
				- 전화 : 182(경찰민원 콜센터)
				<br />
			</p>
		</Docs>
	)
}

export default Privacy
