import Link from 'next/link'
import dynamic from 'next/dynamic'

import { Theme } from '@types'

const Container = dynamic(() => import('@components/Container'))
const Toggle = dynamic(() => import('@components/Toggle'))

const Footer: React.FC<FooterProps> = ({ theme, setTheme }) => {
	return (
		<div className='releative z-30'>
			<div className='bottom-0 bg-discord-black py-24 text-white'>
				<Container className='w-11/12 lg:flex lg:w-4/5 lg:pt-0' ignoreColor>
					<div className='w-full lg:w-2/5'>
						<h1 className='text-2xl font-bold text-koreanbots-blue'>
							국내 디스코드의 모든 것을 한 곳에서.
						</h1>
						<span className='text-base'>2020-2025 한국 디스코드 리스트, All rights reserved.</span>
						<div className='flex space-x-1 text-2xl'>
							<Link href='/discord'>
								<i className='fab fa-discord inline-block w-full' />
							</Link>
							<a href='https://github.com/koreanbots'>
								<i className='fab fa-github inline-block w-full' />
							</a>
							<a href='https://twitter.com/koreanbots'>
								<i className='fab fa-twitter inline-block w-full' />
							</a>
						</div>
					</div>
					<div className='grid grow grid-cols-2 gap-2 md:grid-cols-7'>
						<div className='col-span-2 mb-2'>
							<h2 className='text-base font-bold text-koreanbots-blue'>한국 디스코드 리스트</h2>
							<ul className='text-sm'>
								<li>
									<Link href='/about' className='hover:text-gray-300'>
										소개
									</Link>
								</li>
								<li>
									<Link href='/developers' className='hover:text-gray-300'>
										개발자
									</Link>
								</li>
								<li>
									<Link href='/security' className='hover:text-gray-300'>
										버그 바운티
									</Link>
								</li>
							</ul>
						</div>
						<div className='col-span-2 mb-2'>
							<h2 className='text-base font-bold text-koreanbots-blue'>정책</h2>
							<ul className='text-sm'>
								<li>
									<Link href='/tos' className='hover:text-gray-300'>
										서비스 이용약관
									</Link>
								</li>
								<li>
									<Link href='/privacy' className='hover:text-gray-300'>
										개인정보취급방침
									</Link>
								</li>
								<li>
									<Link href='/guidelines' className='hover:text-gray-300'>
										가이드라인
									</Link>
								</li>
								<li>
									<Link href='/license' className='hover:text-gray-300'>
										라이선스
									</Link>
								</li>
							</ul>
						</div>
						<div className='col-span-1 mb-2'>
							<h2 className='text-base font-bold text-koreanbots-blue'>커뮤니티</h2>
							<ul className='text-sm'>
								{/* <li>
									<Link href='/partners'>
										<a className='hover:text-gray-300'>파트너</a>
									</Link>
								</li> */}
								<li>
									<Link href='/verification' className='hover:text-gray-300'>
										인증
									</Link>
								</li>
							</ul>
						</div>
						<div className='col-span-2 mb-2'>
							<h2 className='text-base font-bold text-koreanbots-blue'>기타</h2>
							<div className='flex'>
								<a className='mr-2 hover:text-gray-300'>다크모드</a>
								<Toggle
									checked={theme === 'dark'}
									onChange={() => {
										const t = theme === 'dark' ? 'light' : 'dark'
										setTheme(t)
										localStorage.setItem('theme', t)
									}}
								/>
							</div>
						</div>
					</div>
				</Container>
			</div>
		</div>
	)
}

interface FooterProps {
	theme: Theme
	setTheme(value: Theme): void
}

export default Footer
