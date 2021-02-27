import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactNode, useState } from 'react'
import Container from './Container'

const SEO = dynamic(() => import('@components/SEO'))

const DeveloperLayout = ({ children, enabled }:DeveloperLayout):JSX.Element => {
	return <div className='flex h-screen'>
		<SEO title='한디리 개발자' description='한국 디스코드봇 리스트 API를 활용하여 봇에 다양한 기능을 추가해보세요.' />
		<div className='w-1/8 lg:hidden pt-20 px-2 h-screen text-center bg-little-white dark:bg-discord-black'>
			<ul className='text-gray-300'>
				<li className={`hover:text-white cursor-pointer py-2 px-4 mb-2 rounded-md ${enabled === 'applications' ? 'bg-discord-blurple text-white' : ''}`}>
					<Link href='/developers/applications'><i className='fas fa-robot'/></Link>
				</li>
				<li className={`hover:text-white cursor-pointer py-2 px-4 my-2 rounded-md ${enabled === 'docs' ? 'bg-discord-blurple text-white' : ''}`}>
					<Link href='/developers/docs'><i className='fas fa-book'/></Link>
				</li>
			</ul>
		</div>
		<div className={'lg:w-1/6 bg-little-white dark:bg-discord-black pt-20 px-6 hidden lg:block h-screen'} >
			<h2 className='font-black text-lg pb-4'>KOREANBOTS DEVELOPERS</h2>
			<ul className='text-base text-gray-300'>
				<li className={`hover:text-white cursor-pointer py-2 px-4 rounded-md ${enabled === 'applications' ? 'bg-discord-blurple text-white' : ''}`}>
					<Link href='/developers/applications'>나의 봇</Link>
				</li>
				<li className={`hover:text-white cursor-pointer py-2 px-4 rounded-md ${enabled === 'docs' ? 'bg-discord-blurple text-white' : ''}`}>
					<Link href='/developers/docs'>문서</Link>
				</li>
			</ul>
		</div>
		<div className='w-full flex-grow py-24 overflow-y-scroll'>
			<Container>
				{children}
			</Container>
		</div>
	</div>
}

interface DeveloperLayout {
  children: ReactNode
  enabled: 'applications' | 'docs'
}

export default DeveloperLayout