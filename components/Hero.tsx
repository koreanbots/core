import dynamic from 'next/dynamic'

import { categories, categoryIcon } from '@utils/Constants'

const Container = dynamic(()=> import('@components/Container'))
const Wave  = dynamic(()=> import('@components/Wave'))
const Tag = dynamic(()=> import('@components/Tag'))
const Search = dynamic(()=> import('@components/Search'))

const Hero = ({ header, description }:HeroProps):JSX.Element => {
	return <>
		<div className='dark:bg-discord-black bg-discord-blurple text-gray-100 md:p-0 mb-8'>
			<Container className='pt-24 pb-16 md:pb-20' ignoreColor>
				<h1 className='hidden md:block text-left text-3xl font-bold'>
					{ header && `${header} - `}한국 디스코드봇 리스트
				</h1>
				<h1 className='md:hidden text-center text-3xl font-semibold'>
					{ header && <span className='text-4xl'>{header}<br/></span>}한국 디스코드봇 리스트
				</h1>
				<p className='text-center sm:text-left text-xl font-base mt-2'>{description || '다양한 국내 디스코드봇을 한곳에서 확인하세요!'}</p>
				<Search />
				<div className='flex flex-wrap mt-5'>
					<Tag key='list' text={<>
						<i className='fas fa-heart text-red-600'/> 하트 랭킹
					</>} dark bigger href='/list/votes' />
					{ categories.slice(0, 4).map(t=> <Tag key={t} text={<>
						<i className={categoryIcon[t]} /> {t}
					</>} dark bigger href={`/categories/${t}`} />) }
					<Tag key='tag' text={<>
						<i className='fas fa-tag'/> 카테고리 더보기
					</>} dark bigger href='/categories' />
				</div>
			</Container>
		</div>
	</>
}

interface HeroProps {
  header?: string
  description?: string
}

export default Hero