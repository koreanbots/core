/* eslint-disable jsx-a11y/click-events-have-key-events */
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

import { DocsData } from '@types'
import { NextSeo } from 'next-seo'

const Container = dynamic(() => import('@components/Container'))
const Divider = dynamic(() => import('@components/Divider'))

const DeveloperLayout: React.FC<DeveloperLayout> = ({
	children,
	enabled,
	docs,
	currentDoc,
}: DeveloperLayout) => {
	const [navbarEnabled, setNavbarOpen] = useState(false)

	return (
		<div className='min-h-screen flex'>
			<NextSeo
				title='한디리 개발자'
				description='한국 디스코드 리스트 API를 활용하여 봇에 다양한 기능을 추가해보세요.'
				openGraph={{
					title: '한디리 개발자',
					description: '한국 디스코드 리스트 API를 활용하여 봇에 다양한 기능을 추가해보세요.',
				}}
			/>
			<div className='relative block h-screen lg:hidden'>
				<div className='w-18 fixed h-full bg-little-white px-2 pt-20 text-center dark:bg-discord-black'>
					<ul className='text-gray-600 dark:text-gray-300'>
						<li
							className={`mb-2 cursor-pointer rounded-md px-4 py-2 ${
								enabled === 'applications'
									? 'bg-discord-blurple text-white'
									: 'hover:text-gray-500 dark:hover:text-white'
							}`}
						>
							<Link href='/developers/applications' legacyBehavior>
								<i className='fas fa-robot' />
							</Link>
						</li>
						<li
							className={`my-2 cursor-pointer rounded-md px-4 py-2 ${
								enabled === 'docs'
									? 'bg-discord-blurple text-white'
									: 'hover:text-gray-500 dark:hover:text-white'
							}`}
						>
							<Link href='/developers/docs' legacyBehavior>
								<i className='fas fa-book' />
							</Link>
						</li>
						{enabled === 'docs' && (
							<>
								<Divider />
								<li
									className='my-2 cursor-pointer rounded-md px-4 py-2 hover:text-gray-500 dark:hover:text-white'
									onKeyDown={() => setNavbarOpen(true)}
									onClick={() => setNavbarOpen(true)}
								>
									<i className='fas fa-bars' />
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
			<div className={`${navbarEnabled ? 'block' : 'hidden'} relative lg:block`}>
				<div className='fixed h-screen w-screen overflow-y-auto bg-little-white px-6 pt-20 dark:bg-discord-black lg:w-60'>
					<ul className='mb-6 hidden text-base text-gray-600 dark:text-gray-300 lg:block'>
						<li
							className='cursor-pointer rounded-md px-4 py-2 hover:text-gray-500 dark:hover:text-white lg:hidden'
							onKeyDown={() => setNavbarOpen(false)}
							onClick={() => setNavbarOpen(false)}
						>
							닫기
						</li>
						<Divider className='lg:hidden' />
						<Link href='/developers/applications' legacyBehavior>
							<li
								className={`cursor-pointer rounded-md px-4 py-2 ${
									enabled === 'applications'
										? 'bg-discord-blurple text-white'
										: 'hover:text-gray-500 dark:hover:text-white'
								}`}
							>
								나의 리스트
							</li>
						</Link>
						<Link href='/developers/docs' legacyBehavior>
							<li
								className={`cursor-pointer rounded-md px-4 py-2 ${
									enabled === 'docs'
										? 'bg-discord-blurple text-white'
										: 'hover:text-gray-500 dark:hover:text-white'
								}`}
							>
								문서
							</li>
						</Link>
					</ul>
					{enabled === 'docs' && (
						<>
							<Divider className='hidden lg:block' />
							<ul className='px-0.5 text-sm text-gray-600 dark:text-gray-300 lg:mt-6'>
								<li
									onClick={() => setNavbarOpen(false)}
									className='mb-2 cursor-pointer rounded-md px-4 py-1 lg:hidden'
								>
									<i className='fas fa-times' /> 닫기
								</li>
								<Divider className='lg:hidden' />
								{docs?.map((el) => {
									if (el.list)
										return (
											<div key={el.name} className='mt-2'>
												<span className='mb-1 font-bold text-gray-600 dark:text-gray-100'>
													{el.name}
												</span>
												<ul className='py-3 text-sm'>
													{el.list.map((e) => (
														<Link
															key={e.name}
															href={`/developers/docs/${el.name}/${e.name}`}
															legacyBehavior
														>
															<li
																onClick={() => setNavbarOpen(false)}
																className={`cursor-pointer rounded-md px-4 py-2 ${
																	currentDoc === e.name
																		? 'bg-discord-blurple text-white'
																		: 'hover:text-gray-500 dark:hover:text-white'
																}`}
															>
																{e.name}
															</li>
														</Link>
													))}
												</ul>
											</div>
										)

									return (
										<Link key={el.name} href={`/developers/docs/${el.name}`} legacyBehavior>
											<li
												onClick={() => setNavbarOpen(false)}
												className={`cursor-pointer rounded-md px-4 py-2 ${
													currentDoc === el.name
														? 'bg-discord-blurple text-white'
														: 'hover:text-gray-500 dark:hover:text-white'
												}`}
											>
												{el.name}
											</li>
										</Link>
									)
								})}
							</ul>
						</>
					)}
				</div>
			</div>
			<div className='w-full py-28 pl-16 lg:pl-60'>
				<Container>{children}</Container>
			</div>
		</div>
	)
}

interface DeveloperLayout {
	children: ReactNode
	enabled: 'applications' | 'docs'
	docs?: DocsData[]
	currentDoc?: string
}

export default DeveloperLayout
