import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactNode } from 'react'

import { DocsData } from '@types'

const Container = dynamic(() => import('@components/Container'))
const Divider = dynamic(() => import('@components/Divider'))
const SEO = dynamic(() => import('@components/SEO'))

const DeveloperLayout = ({ children, enabled, docs, currentDoc }:DeveloperLayout):JSX.Element => {
	return <div className='flex min-h-screen'>
		<SEO title='한디리 개발자' description='한국 디스코드봇 리스트 API를 활용하여 봇에 다양한 기능을 추가해보세요.' />
		<div className='block lg:hidden h-screen relative'>
			<div className='w-16 pt-20 px-2 h-full text-center bg-little-white dark:bg-discord-black fixed'>
				<h2 className='font-black text-koreanbots-blue pb-4'><i className='fas fa-tools'/></h2>
				<ul className='text-gray-600 dark:text-gray-300'>
					<li className={`cursor-pointer py-2 px-4 mb-2 rounded-md ${enabled === 'applications' ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
						<Link href='/developers/applications'><i className='fas fa-robot'/></Link>
					</li>
					<li className={`cursor-pointer py-2 px-4 my-2 rounded-md ${enabled === 'docs' ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
						<Link href='/developers/docs'><i className='fas fa-book'/></Link>
					</li>
				</ul>
			</div>
		</div>
		<div className='hidden lg:block h-screen relative'>
			<div className='bg-little-white dark:bg-discord-black pt-20 px-6 fixed h-full w-60'>
				<h2 className='font-black text-2xl pb-4 text-koreanbots-blue'>DEVELOPERS</h2>
				<ul className='text-base text-gray-600 dark:text-gray-300 mb-6'>
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
						<Divider />
						<ul className='text-sm text-gray-600 dark:text-gray-300 px-0.5 mt-6'>
							{
								docs?.map(el => {
									if(el.list) return <>

										<ul key={el.name} className='text-sm py-3'>
											<span className='text-gray-600 dark:text-gray-100 font-bold my-1'>{el.name}</span>
											{
												el.list.map(e => 
													<Link key={e.name} href={`/developers/docs/${el.name}/${e.name}`}>
														<li className={`cursor-pointer px-4 py-2 rounded-md ${currentDoc === e.name ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
															{e.name}
														</li>
													</Link>
												)
											}
										</ul>
									</>
									return <Link key={el.name} href={`/developers/docs/${el.name}`}>
										<li className={`cursor-pointer py-2 px-4 rounded-md ${currentDoc === el.name ? 'bg-discord-blurple text-white' : 'hover:text-gray-500 dark:hover:text-white'}`}>
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