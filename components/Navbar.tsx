/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { redirectTo } from '@utils/Tools'
import { Theme, UserCache } from '@types'

import DiscordAvatar from '@components/DiscordAvatar'

const Navbar = ({ theme, setTheme }:NavbarProps): JSX.Element => {
	let userCache:UserCache
	try {
		userCache = JSON.parse(localStorage.userCache)
	} catch {
		userCache = null
	}

	const [navbarOpen, setNavbarOpen] = useState<boolean>(false)
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
	const router = useRouter()
	return (
		<>
			<nav className='fixed z-40 top-0 flex flex-wrap items-center justify-between px-2 py-3 w-full text-gray-100 dark:bg-discord-black bg-discord-blurple bg-transparent lg:absolute'>
				<div className='container flex flex-wrap items-center justify-between mx-auto px-4'>
					<div className='relative flex justify-between w-full lg:justify-start lg:w-auto'>
						<Link href='/'>
							<a className='logofont text-large whitespace-no-wrap inline-block mr-4 py-2 hover:text-gray-300 font-semibold leading-relaxed uppercase sm:text-2xl'
							>
							KOREANBOTS
							</a>
						</Link>
						<button
							className='block px-3 py-1 dark:text-gray-200 text-xl leading-none bg-transparent border border-solid border-transparent rounded outline-none focus:outline-none cursor-pointer lg:hidden'
							type='button'
							onClick={() => setNavbarOpen(!navbarOpen)}
						>
							<i className={`fas ${!navbarOpen ? 'fa-bars' : 'fa-times'}`}></i>
						</button>
						<ul className='hidden lg:flex flex-col list-none lg:flex-row lg:ml-auto'>
							<li className='flex items-center'>
								<Link href='/discord'>
									<a className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100'
									>
									디스코드
									</a>
								</Link>
							</li>
							<li className='flex items-center'>
								<Link href='/about'>
									<a className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100'>
										소개
									</a>
								</Link>
							</li>
							<li className='flex items-center'>
								<Link href='/api'>
									<a className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100'>
										API
									</a>
								</Link>
							</li>
							<li className='flex items-center'>
								<Link href='/addbot'>
									<a className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100'>
										봇 추가하기
									</a>
								</Link>
							</li>
						</ul>
					</div>
					<div className='hidden flex-grow items-center bg-white lg:flex lg:bg-transparent lg:shadow-none'>
						<ul className='flex flex-col list-none lg:flex-row lg:ml-auto'>
							<li className='flex items-center outline-none' onFocus={() => setDropdownOpen(true)} onMouseOver={() => setDropdownOpen(true)} onMouseOut={() => setDropdownOpen(false)} onBlur={() => setDropdownOpen(false)}>
								{
									userCache?.id && userCache.version === 2 ? 
										<a 
											className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100 cursor-pointer'>
											<DiscordAvatar userID={userCache.id} className='w-8 h-8 rounded-full mr-1.5' size={128}/>
											{userCache.username} <i className='ml-2 fas fa-sort-down' /> 
										</a> :
										<a tabIndex={0} onKeyPress={()=> {
											if(!userCache) {
												localStorage.redirectTo = window.location.href
												setNavbarOpen(false)
												redirectTo(router, 'login')
											}
										}} onClick={()=> {
											if(!userCache) {
												localStorage.redirectTo = window.location.href
												setNavbarOpen(false)
												redirectTo(router, 'login')
											}
										}} className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100 cursor-pointer'>
											로그인
										</a>
								}
								
								{ userCache ? <div className={`rounded shadow-md absolute mt-14 top-0 w-48 bg-white text-black dark:bg-very-black dark:text-gray-300 text-sm ${dropdownOpen ? 'block' : 'hidden'}`}>
									<ul className='relative'>
										<li>
											<Link href={`/users/${userCache.id}`}>
												<a className='px-4 py-2 block hover:bg-gray-100 dark:hover:bg-discord-dark-hover rounded-t'><i className='fas fa-user' /> 프로필</a>
											</Link>
										</li>
										<li>
											<Link href='/panel'>
												<a className='px-4 py-2 block hover:bg-gray-100 dark:hover:bg-discord-dark-hover'><i className='fas fa-cogs' /> 관리패널</a>
											</Link>
										</li>
										{/* <li><hr className='border-t mx-2'/></li> */}
										<li>
											<a onKeyPress={() => { 
												localStorage.removeItem('userCache')
												redirectTo(router, 'logout')
											}
											} onClick={() => { 
												localStorage.removeItem('userCache')
												redirectTo(router, 'logout')
											}} className='px-4 py-2 block text-red-500 hover:bg-gray-100 dark:hover:bg-discord-dark-hover rounded-b cursor-pointer'><i className='fas fa-sign-out-alt' /> 로그아웃</a>
										</li>
									</ul>
								</div> : ''}
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<div
				className={`z-30 w-full h-full fixed bg-discord-blurple dark:bg-discord-black mt-8 sm:mt-0 lg:hidden overflow-y-scroll lg:scroll-none ${
					navbarOpen ? 'block' : 'hidden'
				}`}
			>
				<nav className='mt-20'>
					<Link href='/discord'>
						<a onClick={()=> setNavbarOpen(false)} className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
							<i className='fab fa-discord' />
							<span className='px-2 font-medium'>디스코드 서버</span>
						
						</a>
					</Link>
					<Link href='/about'>
						<a onClick={()=> setNavbarOpen(false)} className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
							<svg
								className='w-5 h-5'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>

							<span className='px-2 font-medium'>소개</span>
						</a>
					</Link>
					<Link href='/api'>
						<a onClick={()=> setNavbarOpen(false)} className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
							<i className='fas fa-tools' />

							<span className='px-2 font-medium'>API</span>
						</a>
					</Link>
					<Link href='/addbot'>
						<a onClick={()=> setNavbarOpen(false)} className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
							<i className='fas fa-plus'></i>
							<span className='px-2 font-medium'>봇 추가하기</span>
						</a>
					</Link>
					
				</nav>

				<div className='my-10'>
					{
						userCache?.id && userCache.version === 2? <>
							<Link href={`/users/${userCache.id}`}>
								<a className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
									<i className='far fa-user' />
									<span className='px-2 font-medium'>{userCache.username}</span>
								</a>
							</Link>
							<Link href='/panel'>
								<a className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
									<i className='fas fa-cogs' />
									<span className='px-2 font-medium'>관리패널</span>
								</a>
							</Link>
							<a onClick={()=> {
								localStorage.removeItem('userCache')
								redirectTo(router, 'logout')
							}} className='flex items-center px-8 py-2 text-red-500 hover:text-red-400'>
								<i className='fas fa-sign-out-alt' />
								<span className='px-2 font-medium'>로그아웃</span>
							</a>
						</> : <Link href='/api/auth/discord'>
							<a onClick={()=> {
								localStorage.redirectTo = window.location.href
								setNavbarOpen(false)
							}} className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
								<i className='far fa-user' />
								<span className='px-2 font-medium'>로그인</span>
							</a>
						</Link>
					}
				</div>
			</div>
		</>
	)
}

interface NavbarProps {
	theme: Theme
	setTheme(value: Theme): void
}

export default Navbar
