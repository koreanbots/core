/* eslint-disable jsx-a11y/click-events-have-key-events */
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

import { DocsData } from '@types'

const Container = dynamic(() => import('@components/Container'))
const Divider = dynamic(() => import('@components/Divider'))
const SEO = dynamic(() => import('@components/SEO'))

const DeveloperLayout = ({ children, enabled, docs, currentDoc }:DeveloperLayout):JSX.Element => {
	const [ navbarEnabled, setNavbarOpen ] = useState(false)

	return <div className='flex min-h-screen'>
		<SEO title='한디리 개발자' description='한국 디스코드봇 리스트 API를 활용하여 봇에 다양한 기능을 추가해보세요.' />
		<div className='block lg:hidden h-screen relative'>
			<div className='w-18 pt-20 px-2 h-full text-center bg-little-white dark:bg-discord-black fixed'>
				<ul className='text-gray-600 dark:text-gray-300'>
					<li className={`cursor-pointer py-2 px-4 mb-2 rounded-md ${enabled === 'applications' ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
						<Link href='/developers/applications'><i className='fas fa-robot'/></Link>
					</li>
					<li className={`cursor-pointer py-2 px-4 my-2 rounded-md ${enabled === 'docs' ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
						<Link href='/developers/docs'><i className='fas fa-book'/></Link>
					</li>
					{
						enabled === 'docs' && <>
							<Divider />
							<li className='cursor-pointer py-2 px-4 my-2 rounded-md hover:text-gray-500 dark:hover:text-white' onKeyDown={() => setNavbarOpen(true)} onClick={() => setNavbarOpen(true)}>
								<i className='fas fa-bars'/>
							</li></>
					}
				</ul>
			</div>
		</div>
		<div className={`${navbarEnabled ? 'block' : 'hidden'} lg:block relative`}>
			<div className='bg-little-white dark:bg-discord-black pt-20 px-6 fixed h-screen w-screen lg:w-60 overflow-y-auto'>
				<ul className='text-base text-gray-600 dark:text-gray-300 mb-6 hidden lg:block'>
					<li className='cursor-pointer py-2 px-4 rounded-md hover:text-gray-500 dark:hover:text-white lg:hidden' onKeyDown={() => setNavbarOpen(false)} onClick={() => setNavbarOpen(false)}>닫기</li>
					<Divider className='lg:hidden' />
					<Link href='/developers/applications'>
						<li className={`cursor-pointer py-2 px-4 rounded-md ${enabled === 'applications' ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
						나의 봇
						</li>
					</Link>
					<Link href='/developers/docs'>
						<li className={`cursor-pointer py-2 px-4 rounded-md ${enabled === 'docs' ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
						문서
						</li>
					</Link>
				</ul>
				{
					enabled === 'docs' && <>
						<Divider className='hidden lg:block' />
						<ul className='text-sm text-gray-600 dark:text-gray-300 px-0.5 lg:mt-6'>
							<li onClick={() => setNavbarOpen(false)} className='lg:hidden cursor-pointer py-1 px-4 rounded-md mb-2'>
								<i className='fas fa-times' /> 닫기
							</li>
							<Divider className='lg:hidden' />
							{
								docs?.map(el => {
									if(el.list) return <div key={el.name} className='mt-2'>
										<span className='text-gray-600 dark:text-gray-100 font-bold mb-1'>{el.name}</span>
										<ul className='text-sm py-3'>
											{
												el.list.map(e => 
													<Link key={e.name} href={`/developers/docs/${el.name}/${e.name}`}>
														<li onClick={() => setNavbarOpen(false)} className={`cursor-pointer px-4 py-2 rounded-md ${currentDoc === e.name ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
															{e.name}
														</li>
													</Link>
												)
											}
										</ul>
									</div>
								
									return <Link key={el.name} href={`/developers/docs/${el.name}`}>
										<li onClick={() => setNavbarOpen(false)} className={`cursor-pointer py-2 px-4 rounded-md ${currentDoc === el.name ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
											{el.name}
										</li>
									</Link>
								})
							}
						</ul>
					</>
				}
			</div>
		</div>
		<div className='w-full py-28 lg:pl-60 pl-16'>
			<Container>
				{children}
			</Container>
		</div>
	</div>
}

interface DeveloperLayout {
  children: ReactNode
  enabled: 'applications' | 'docs'
	docs?: DocsData[]
	currentDoc?: string
}

export default DeveloperLayout
