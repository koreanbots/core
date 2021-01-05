import Link from 'next/link'
import { useState } from 'react'

const Navbar = (): JSX.Element => {
	const [navbarOpen, setNavbarOpen] = useState<boolean>(false)
	return (
		<>
			<nav className="absolute bg-transparent z-50 top-0 flex flex-wrap items-center justify-between px-2 py-3 w-full text-gray-100 bg-discord-blurple dark:bg-discord-black" style={{ background: 'transparent' }}>
				<div className="container flex flex-wrap items-center justify-between mx-auto px-4">
					<div className="relative flex justify-between w-full lg:static lg:block lg:justify-start lg:w-auto">
						<a
							className="logofont text-large whitespace-no-wrap inline-block mr-4 py-2 hover:text-gray-200 font-semibold leading-relaxed uppercase sm:text-2xl"
							href="/"
						>
							KOREANBOTS
						</a>
						<button
							className="block px-3 py-1 dark:text-gray-200 text-xl leading-none bg-transparent border border-solid border-transparent rounded outline-none focus:outline-none cursor-pointer lg:hidden"
							type="button"
							onClick={() => setNavbarOpen(!navbarOpen)}
						>
							<i className={`fas ${!navbarOpen ? 'fa-bars' : 'fa-times'}`}></i>
						</button>
					</div>
					<div
						className={
							'lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none' +
							(navbarOpen ? ' block rounded shadow-lg' : ' hidden')
						}
					>
						<ul className="flex flex-col list-none lg:flex-row lg:ml-auto">
							<li className="flex items-center">
								<a
									href="/discord"
									className="lg:text-gray-100 lg:hover:text-gray-200 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2"
								>
									디스코드
								</a>
							</li>
							<li className="flex items-center">
								<Link href="/about">
									<a className="lg:text-gray-100 lg:hover:text-gray-200 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2">
										소개
									</a>
								</Link>
							</li>
							<li className="flex items-center">
								<Link href="/api">
									<a className="lg:text-gray-100 lg:hover:text-gray-200 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2">
										API
									</a>
								</Link>
							</li>
							<li className="flex items-center">
								<Link href="/addbot">
									<a className="lg:text-gray-100 lg:hover:text-gray-200 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2">
										봇 추가하기
									</a>
								</Link>
							</li>
							<li className="flex items-center">
								<Link href="/api/auth/discord">
									<a className="lg:text-gray-100 lg:hover:text-gray-200 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2">
										로그인
									</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}

export default Navbar
