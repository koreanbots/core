import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import ColorCard from '@components/ColorCard'
import Divider from '@components/Divider'
import Docs from '@components/Docs'
import Segment from '@components/Segment'
import { ThemeColors } from '@utils/Constants'

const Container = dynamic(() => import('@components/Container'))

const About: NextPage = () => {
	return (
		<div className='pb-10'>
			<Docs
				title='소개'
				header={
					<h1 className='text-4xl font-black dark:text-koreanbots-blue'>
						“국내 디스코드의 모든 것을 한 곳에서.”
					</h1>
				}
				subheader='한국 디스코드 리스트에서 자신에게 필요한 디스코드의 모든 것을 찾아보세요!'
			>
				<Container>
					<div className='py-1'>
						<h1 className='my-5 text-5xl font-bold'>소개</h1>
						<p className='text-lg'>
							<span className='font-bold text-koreanbots-blue'>한국 디스코드 리스트</span>는 본인의
							봇과 서버를 직접 등록하고, 유저 분은 봇 또는 서버를 카테고리별로 확인할 수 있는
							플랫폼입니다.
						</p>
						<p className='text-lg'>자신에게 필요한 디스코드의 모든 것을 찾아보세요!</p>
						<Divider />
						<h1 className='my-5 text-5xl font-bold'>특징</h1>
						<div className='grid gap-12 px-4 pb-5 md:grid-cols-3'>
							<div className='mx-auto font-normal'>
								<h2 className='mb-1 text-3xl font-bold text-koreanbots-blue'>하트 시스템</h2>
								<p className='text-base'>
									마음에 드는 봇이나 서버에 투표하는 하트 시스템으로 유용한 봇 또는 서버가 상단에
									노출될 수 있는 기회를 제공합니다.
								</p>
							</div>
							<div className='mx-auto font-normal'>
								<h2 className='mb-1 text-3xl font-bold text-koreanbots-blue'>인증 시스템</h2>
								<p className='text-base'>
									봇은 디스코드 봇 인증보다 한 단계 까다로운 기준을 적용하며 서버는 신뢰할 수 있는
									서버를 정해, 이용자분들에게 신뢰감을 줍니다.
								</p>
							</div>
							<div className='mx-auto font-normal'>
								<h2 className='mb-1 text-3xl font-bold text-koreanbots-blue'>API 제공</h2>
								<p className='text-base'>
									정보부터, 유저 투표 여부 확인, 위젯까지.
									<br />
									다양한 API를 제공하여 커스텀할 수 있습니다!
								</p>
							</div>
						</div>
						<Divider />
						<h1 className='my-5 text-5xl font-bold'>브랜드</h1>
						<h2 className='mb-7 text-3xl font-semibold'>슬로건</h2>
						<Segment>
							<h2 className='py-10 text-center text-xl font-semibold'>
								<i className='fas fa-quote-left align-top text-xs' />
								국내 디스코드의 모든 것을 한 곳에서.
								<i className='fas fa-quote-right align-bottom text-xs' />
							</h2>
						</Segment>
						<Divider className='mt-7' />
						<h2 className='my-7 text-3xl font-semibold'>로고</h2>
						<Segment>
							<>
								로고를 수정하거나, 변경, 왜곡 등 기타 다른 방법으로 로고를 수정하지 말아주세요.
								<div className='grid md:grid-cols-2 lg:grid-cols-4'>
									<div>
										<img src='/logo.png' alt='Logo' />
										<div className='text-right text-blue-400'>
											<a href='/logo.png' download='koreanbots.png'>
												.png
											</a>
										</div>
									</div>
								</div>
								<h3 className='my-1 text-xl font-bold'>폰트</h3>
								<p className='text-md my-1 font-bold'>영문: Uni Sans Heavy | 한글: Gugi</p>
							</>
						</Segment>
						<Divider className='mt-7' />
						<h2 className='my-5 text-3xl font-semibold'>색상</h2>
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
							{ThemeColors.map((el) => (
								<ColorCard
									key={el.color}
									header={el.name}
									first={el.rgb}
									second={el.hex}
									className={`bg-${el.color} ${
										el.color.includes('white') ? 'text-black' : 'text-white'
									}`}
								/>
							))}
						</div>
					</div>
				</Container>
			</Docs>
		</div>
	)
}

export default About
