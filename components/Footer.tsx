import Link from 'next/link'
import Container from '@components/Container'

import Toggle from './Toggle'
import { Theme } from '@types'

const Footer = ({ theme, setTheme }: FooterProps): JSX.Element => {
	return (
		<div className='releative z-30'>
			<div className='bottom-0 text-white bg-discord-black py-24'>
				<Container className='w-11/12 lg:flex lg:pt-0 lg:w-4/5' ignoreColor>
					<div className='w-full lg:w-2/5'>
						<h1 className='text-koreanbots-blue text-3xl font-bold'>국내봇을 한 곳에서.</h1>
						<span className='text-base'>2020-2021 Koreanbots, All rights reserved.</span>
						<div className='text-2xl'>
							<Link href='/discord'>
								<a className='mr-2'>
									<i className='fab fa-discord' />
								</a>
							</Link>
							<a href='https://github.com/koreanbots' className='mr-2'>
								<i className='fab fa-github' />
							</a>
							<a href='https://twitter.com/koreanbots' className='mr-2'>
								<i className='fab fa-twitter' />
							</a>
						</div>
					</div>
					<div className='grid flex-grow gap-2 grid-cols-2 md:grid-cols-7'>
						<div className='col-span-2 mb-2'>
							<h2 className='text-koreanbots-blue text-base font-bold'>한국 디스코드봇 리스트</h2>
							<ul className='text-sm'>
								<li>
									<Link href='/about'>
										<a className='hover:text-gray-300'>소개</a>
									</Link>
								</li>
								<li>
									<Link href='/developers'>
										<a className='hover:text-gray-300'>개발자</a>
									</Link>
								</li>
								<li>
									<Link href='/security'>
										<a className='hover:text-gray-300'>버그 바운티</a>
									</Link>
								</li>
							</ul>
						</div>
						<div className='col-span-2 mb-2'>
							<h2 className='text-koreanbots-blue text-base font-bold'>정책</h2>
							<ul className='text-sm'>
								<li>
									<Link href='/privacy'>
										<a className='hover:text-gray-300'>개인정보취급방침</a>
									</Link>
								</li>
								<li>
									<Link href='/guidelines'>
										<a className='hover:text-gray-300'>가이드라인</a>
									</Link>
								</li>
								<li>
									<Link href='/license'>
										<a className='hover:text-gray-300'>오픈소스 라이선스</a>
									</Link>
								</li>
							</ul>
						</div>
						<div className='col-span-1 mb-2'>
							<h2 className='text-koreanbots-blue text-base font-bold'>커뮤니티</h2>
							<ul className='text-sm'>
								{/* <li>
									<Link href='/partners'>
										<a className='hover:text-gray-300'>파트너</a>
									</Link>
								</li> */}
								<li>
									<Link href='/verification'>
										<a className='hover:text-gray-300'>인증</a>
									</Link>
								</li>
							</ul>
						</div>
						<div className='col-span-2 mb-2'>
							<h2 className='text-koreanbots-blue text-base font-bold'>기타</h2>
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
