/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Logo from 'public/logo-transparent.png'
import { useEffect, useState } from 'react'

import { Nullable, User, UserCache } from '@types'
import Fetch from '@utils/Fetch'
import { redirectTo } from '@utils/Tools'

const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))

const Navbar: React.FC<NavbarProps> = ({ token }) => {
	const [userCache, setUserCache] = useState<UserCache>()
	const [navbarOpen, setNavbarOpen] = useState<boolean>(false)
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
	const [addDropdownOpen, setAddDropdownOpen] = useState<boolean>(false)
	const [mobileAddDropdownOpen, setMobileAddDropdownOpen] = useState<boolean>(false)
	const router = useRouter()
	const logged = userCache?.id && userCache.version === 2
	const type: Nullable<'bot' | 'server'> = router.pathname.startsWith('/bots')
		? 'bot'
		: router.pathname.startsWith('/servers')
		  ? 'server'
		  : null
	const dev = router.pathname.startsWith('/developers')

	useEffect(() => {
		try {
			if (localStorage.userCache) {
				setUserCache(token ? JSON.parse(localStorage.userCache) : null)
			}
			Fetch<User>('/users/@me').then((data) => {
				if (data.code !== 200) return
				setUserCache(
					JSON.parse(
						(localStorage.userCache = JSON.stringify({
							id: data.data.id,
							username: data.data.globalName,
							tag: data.data.tag,
							version: 2,
						}))
					)
				)
			})
		} catch {
			setUserCache(null)
		}
	}, [token])
	return (
		<>
			<nav className='fixed top-0 z-40 flex w-full flex-wrap items-center justify-between bg-discord-blurple px-2 py-3 text-gray-100 dark:bg-discord-black lg:absolute'>
				<div className='container mx-auto flex flex-wrap items-center justify-between px-4'>
					<div className='relative flex w-full justify-between lg:w-auto lg:justify-start'>
						<Link
							href={dev ? '/developers' : '/'}
							className={`${
								dev ? 'dark:text-koreanbots-blue ' : ''
							}logofont text-large whitespace-no-wrap mr-4 inline-block py-2 font-semibold uppercase leading-relaxed hover:text-gray-300 sm:text-2xl`}
						>
              {dev ? (
              <>
                <i className='fas fa-tools mr-1' /> DEVELOPERS
              </>
              ) : (
                <Image
                  src={Logo}
                  alt='Koreanbots'
                  width={100}
                  height={100}
                  className='h-10 w-10'
                />
              )}
						</Link>
						<button
							className='block cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none outline-none focus:outline-none dark:text-gray-200 lg:hidden'
							type='button'
							onClick={() => setNavbarOpen(!navbarOpen)}
						>
							<i className={`fas ${!navbarOpen ? 'fa-bars' : 'fa-times'}`}></i>
						</button>
						<ul className='hidden list-none flex-col lg:ml-auto lg:flex lg:flex-row'>
							<li className='flex items-center'>
								<Link
									href={dev ? '/' : '/developers'}
									className='flex w-full items-center px-3 py-4 text-sm font-semibold text-gray-700 hover:text-gray-500 sm:w-auto lg:py-2 lg:text-gray-100 lg:hover:text-gray-300'
								>
									{dev ? '홈' : '개발자'}
								</Link>
							</li>
							{type !== 'bot' && (
								<li className='flex items-center'>
									<Link
										href='/bots'
										className='flex w-full items-center px-3 py-4 text-sm font-semibold text-gray-700 hover:text-gray-500 sm:w-auto lg:py-2 lg:text-gray-100 lg:hover:text-gray-300'
									>
										봇 리스트
									</Link>
								</li>
							)}
							{type !== 'server' && (
								<li className='flex items-center'>
									<Link
										href='/servers'
										className='flex w-full items-center px-3 py-4 text-sm font-semibold text-gray-700 hover:text-gray-500 sm:w-auto lg:py-2 lg:text-gray-100 lg:hover:text-gray-300'
									>
										서버 리스트
									</Link>
								</li>
							)}
							<li className='flex items-center'>
								<Link
									href='/discord'
									target='_blank'
									rel='noreferrer'
									className='flex w-full items-center px-3 py-4 text-sm font-semibold text-gray-700 hover:text-gray-500 sm:w-auto lg:py-2 lg:text-gray-100 lg:hover:text-gray-300'
								>
									디스코드
								</Link>
							</li>
							<li className='flex items-center'>
								<Link
									href='/about'
									className='flex w-full items-center px-3 py-4 text-sm font-semibold text-gray-700 hover:text-gray-500 sm:w-auto lg:py-2 lg:text-gray-100 lg:hover:text-gray-300'
								>
									소개
								</Link>
							</li>
							<li
								className='flex items-center'
								onFocus={() => setAddDropdownOpen(true)}
								onMouseOver={() => setAddDropdownOpen(true)}
								onMouseOut={() => setAddDropdownOpen(false)}
								onBlur={() => setAddDropdownOpen(false)}
							>
								<span className='flex w-full cursor-pointer items-center px-3 py-4 text-sm font-semibold text-gray-700 hover:text-gray-500 sm:w-auto lg:py-2 lg:text-gray-100 lg:hover:text-gray-300'>
									추가하기
								</span>
								<div
									className={`absolute top-0 mt-11 w-40 rounded bg-white text-sm text-black shadow-md dark:bg-very-black dark:text-gray-300 ${
										addDropdownOpen ? 'block' : 'hidden'
									}`}
								>
									<ul className='relative'>
										<li>
											<Link
												href='/addbot'
												className='block rounded-t px-4 py-2 hover:bg-gray-100 dark:hover:bg-discord-dark-hover'
											>
												<i className='fas fa-robot' />봇 추가하기
											</Link>
										</li>
										<li>
											<Link
												href='/addserver'
												className='block rounded-b px-4 py-2 hover:bg-gray-100 dark:hover:bg-discord-dark-hover'
											>
												<i className='fas fa-users' />
												서버 추가하기
											</Link>
										</li>
									</ul>
								</div>
							</li>
						</ul>
					</div>
					<div className='hidden grow items-center bg-white lg:flex lg:bg-transparent lg:shadow-none'>
						<ul className='flex list-none flex-col lg:ml-auto lg:flex-row'>
							<li
								className='flex items-center outline-none'
								onFocus={() => setDropdownOpen(true)}
								onMouseOver={() => setDropdownOpen(true)}
								onMouseOut={() => setDropdownOpen(false)}
								onBlur={() => setDropdownOpen(false)}
							>
								{logged ? (
									<>
										<a className='flex w-full cursor-pointer items-center px-3 py-4 text-sm font-semibold text-gray-700 hover:text-gray-500 sm:w-auto lg:py-2 lg:text-gray-100 lg:hover:text-gray-300'>
											<DiscordAvatar
												userID={userCache.id}
												className='mr-1.5 h-8 w-8 rounded-full'
												size={128}
											/>
											{userCache.username} <i className='fas fa-sort-down ml-2' />
										</a>
										<div
											className={`absolute top-0 mt-14 w-48 rounded bg-white text-sm text-black shadow-md dark:bg-very-black dark:text-gray-300 ${
												dropdownOpen ? 'block' : 'hidden'
											}`}
										>
											<ul className='relative'>
												<li>
													<Link
														href={`/users/${userCache.id}`}
														className='block rounded-t px-4 py-2 hover:bg-gray-100 dark:hover:bg-discord-dark-hover'
													>
														<i className='fas fa-user w-5' />
														프로필
													</Link>
												</li>
												<li>
													<Link
														href='/panel'
														className='block px-3 py-2 hover:bg-gray-100 dark:hover:bg-discord-dark-hover'
													>
														<i className='fas fa-cogs mr-1 w-5' />
														관리패널
													</Link>
												</li>
												{/* <li><hr className='border-t mx-2'/></li> */}
												<li>
													<a
														onKeyPress={() => {
															localStorage.removeItem('userCache')
															redirectTo(router, 'logout')
														}}
														onClick={() => {
															localStorage.removeItem('userCache')
															redirectTo(router, 'logout')
														}}
														className='block cursor-pointer rounded-b px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-discord-dark-hover'
													>
														<i className='fas fa-sign-out-alt' />
														로그아웃
													</a>
												</li>
											</ul>
										</div>
									</>
								) : (
									<a
										tabIndex={0}
										onClick={() => {
											localStorage.redirectTo = window.location.href
											setNavbarOpen(false)
											redirectTo(router, 'login')
										}}
										className='flex w-full cursor-pointer items-center px-3 py-4 text-sm font-semibold text-gray-700 outline-none hover:text-gray-500 sm:w-auto lg:py-2 lg:text-gray-100 lg:hover:text-gray-300'
									>
										로그인
									</a>
								)}
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<div
				className={`lg:scroll-none fixed z-30 mt-8 h-full w-full overflow-y-scroll bg-discord-blurple dark:bg-discord-black sm:mt-0 lg:hidden ${
					navbarOpen ? 'block' : 'hidden'
				}`}
			>
				<nav className='mt-20'>
					<Link
						href={dev ? '/' : '/developers'}
						onClick={() => setNavbarOpen(false)}
						className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
					>
						{dev ? <i className='fas fa-home' /> : <i className='fas fa-tools' />}
						<span className='px-2 font-medium'>{dev ? '홈' : '개발자'}</span>
					</Link>
					{type !== 'bot' && (
						<Link
							href='/bots'
							onClick={() => setNavbarOpen(false)}
							className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
						>
							<i className='fas fa-robot' />
							<span className='px-2 font-medium'>봇 리스트</span>
						</Link>
					)}
					{type !== 'server' && (
						<Link
							href='/servers'
							onClick={() => setNavbarOpen(false)}
							className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
						>
							<i className='fas fa-users' />
							<span className='px-2 font-medium'>서버 리스트</span>
						</Link>
					)}
					<Link
						href='/discord'
						target='_blank'
						rel='noreferrer'
						onClick={() => setNavbarOpen(false)}
						className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
					>
						<i className='fab fa-discord' />
						<span className='px-2 font-medium'>디스코드 서버</span>
					</Link>
					<Link
						href='/about'
						onClick={() => setNavbarOpen(false)}
						className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
					>
						<i className='fas fa-layer-group' />
						<span className='px-2 font-medium'>소개</span>
					</Link>
					<a
						onClick={() => {
							setMobileAddDropdownOpen(!mobileAddDropdownOpen)
						}}
						className='flex items-center px-8 py-2 text-gray-100'
					>
						<i className='fas fa-plus' />
						<span className='px-2 font-medium'>추가하기</span>
					</a>
					<div className={mobileAddDropdownOpen ? 'flex flex-col px-4' : 'hidden px-4'}>
						<Link
							href='/addbot'
							onClick={() => setNavbarOpen(false)}
							className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
						>
							<i className='fas fa-robot' />
							<span className='px-2 font-medium'>봇 추가하기</span>
						</Link>
						<Link
							href='/addserver'
							onClick={() => setNavbarOpen(false)}
							className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
						>
							<i className='fas fa-users' />
							<span className='px-2 font-medium'>서버 추가하기</span>
						</Link>
					</div>
				</nav>

				<div className='my-10'>
					{logged ? (
						<>
							<Link
								href={`/users/${userCache.id}`}
								className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
								onClick={() => setNavbarOpen(!navbarOpen)}
							>
								<i className='far fa-user' />
								<span className='px-2 font-medium'>{userCache.username}</span>
							</Link>
							<Link
								href='/panel'
								className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
								onClick={() => setNavbarOpen(!navbarOpen)}
							>
								<i className='fas fa-cogs' />
								<span className='px-2 font-medium'>관리패널</span>
							</Link>
							<a
								onClick={() => {
									setNavbarOpen(!navbarOpen)
									localStorage.removeItem('userCache')
									redirectTo(router, 'logout')
								}}
								className='flex items-center px-8 py-2 text-red-500 hover:text-red-400'
							>
								<i className='fas fa-sign-out-alt' />
								<span className='px-2 font-medium'>로그아웃</span>
							</a>
						</>
					) : (
						<a
							onClick={() => {
								localStorage.redirectTo = window.location.href
								setNavbarOpen(false)
								redirectTo(router, 'login')
							}}
							className='flex items-center px-8 py-2 text-gray-100 hover:text-gray-300'
						>
							<i className='far fa-user' />
							<span className='px-2 font-medium'>로그인</span>
						</a>
					)}
				</div>
			</div>
		</>
	)
}

interface NavbarProps {
	token: string
}

export default Navbar
