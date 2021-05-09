/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { redirectTo } from '@utils/Tools'
import { User, UserCache } from '@types'

import DiscordAvatar from '@components/DiscordAvatar'
import Fetch from '@utils/Fetch'

const Navbar = ({ token }:{ token: string }): JSX.Element => {
	const [userCache, setUserCache] = useState<UserCache>()
	const [navbarOpen, setNavbarOpen] = useState<boolean>(false)
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
	const router = useRouter()
	const logged = userCache?.id && userCache.version === 2
	const dev = router.pathname.startsWith('/developers')

	useEffect(() => {
		try {
			if(localStorage.userCache) {
				setUserCache(token ? JSON.parse(localStorage.userCache) : null)
			}
			Fetch<User>('/users/@me').then(data => {
				if(data.code !== 200) return
				setUserCache(JSON.parse(localStorage.userCache = JSON.stringify({
					id: data.data.id,
					username: data.data.username,
					tag: data.data.tag,
					version: 2
				})))
			})
		} catch {
			setUserCache(null)
		}
	}, [ token ])
	return (
		<>
			<nav className='fixed z-40 top-0 flex flex-wrap items-center justify-between px-2 py-3 w-full text-gray-100 dark:bg-discord-black bg-discord-blurple bg-transparent lg:absolute'>
				<div className='container flex flex-wrap items-center justify-between mx-auto px-4'>
					<div className='relative flex justify-between w-full lg:justify-start lg:w-auto'>
						<Link href={dev ? '/developers' : '/'}>
							<a className={`${dev ? 'text-koreanbots-blue ' : ''}logofont text-large whitespace-no-wrap inline-block mr-4 py-2 hover:text-gray-300 font-semibold leading-relaxed uppercase sm:text-2xl`}
							>
								{ dev ? <><i className='fas fa-tools mr-1'/> DEVELOPERS</> : 'KOREANBOTS'}
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
								<Link href={dev ? '/' : '/developers'}>
									<a className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100'>
										{dev ? '홈' : '개발자'}
									</a>
								</Link>
							</li>
							<li className='flex items-center'>
								<Link href='/discord'>
									<a target='_blank' rel='noreferrer' className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100'
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
									logged ? 
										<>
											<a 
												className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100 cursor-pointer'>
												<DiscordAvatar userID={userCache.id} className='w-8 h-8 rounded-full mr-1.5' size={128}/>
												{userCache.username} <i className='ml-2 fas fa-sort-down' /> 
											</a>
											<div className={`rounded shadow-md absolute mt-14 top-0 w-48 bg-white text-black dark:bg-very-black dark:text-gray-300 text-sm ${dropdownOpen ? 'block' : 'hidden'}`}>
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
											</div>
										</> :
										<a tabIndex={0} onKeyPress={()=> {
											if(!(logged)) {
												localStorage.redirectTo = window.location.href
												setNavbarOpen(false)
												redirectTo(router, 'login')
											}
										}} onClick={()=> {
											if(!(logged)) {
												localStorage.redirectTo = window.location.href
												setNavbarOpen(false)
												redirectTo(router, 'login')
											}
										}} className='lg:hover:text-gray-300 flex items-center px-3 py-4 w-full hover:text-gray-500 text-gray-700 text-sm font-semibold sm:w-auto lg:py-2 lg:text-gray-100 cursor-pointer outline-none'>
											로그인
										</a>
								}
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
					<Link href={dev ? '/' : '/developers'}>
						<a onClick={()=> setNavbarOpen(false)} className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
							{
								dev ? <i className='fas fa-home' /> : <i className='fas fa-tools' />
							}
							<span className='px-2 font-medium'>	
								{dev ? '홈' : '개발자'}
							</span>
						</a>
					</Link>
					<Link href='/discord'>
						<a target='_blank' rel='noreferrer' onClick={()=> setNavbarOpen(false)} className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
							<i className='fab fa-discord' />
							<span className='px-2 font-medium'>디스코드 서버</span>
						</a>
					</Link>
					<Link href='/about'>
						<a onClick={()=> setNavbarOpen(false)} className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
							<i className='fas fa-layer-group' />
							<span className='px-2 font-medium'>소개</span>
						</a>
					</Link>
					<Link href='/addbot'>
						<a onClick={()=> setNavbarOpen(false)} className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'>
							<i className='fas fa-plus' />
							<span className='px-2 font-medium'>봇 추가하기</span>
						</a>
					</Link>
				</nav>

				<div className='my-10'>
					{
						logged ? <>
							<Link href={`/users/${userCache.id}`}>
								<a className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300' onClick={() => setNavbarOpen(!navbarOpen)}>
									<i className='far fa-user' />
									<span className='px-2 font-medium'>{userCache.username}</span>
								</a>
							</Link>
							<Link href='/panel'>
								<a className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300' onClick={() => setNavbarOpen(!navbarOpen)}>
									<i className='fas fa-cogs' />
									<span className='px-2 font-medium'>관리패널</span>
								</a>
							</Link>
							<a onClick={()=> {
								setNavbarOpen(!navbarOpen)
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

export default Navbar
