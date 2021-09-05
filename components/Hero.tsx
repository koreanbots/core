import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'

import { botCategories, botCategoryIcon, serverCategories, serverCategoryIcon } from '@utils/Constants'

const Container = dynamic(()=> import('@components/Container'))
const Tag = dynamic(()=> import('@components/Tag'))
const Search = dynamic(()=> import('@components/Search'))

const Hero:React.FC<HeroProps> = ({ type='all', header, description }) => {
	const link = `/${type}/categories`
	return <>
		<NextSeo title={header} description={description} openGraph={{
			title: header,
			description
		}} />
		<div className='dark:bg-discord-black bg-discord-blurple text-gray-100 md:p-0 mb-8'>
			<Container className='pt-24 pb-16 md:pb-20' ignoreColor>
				<h1 className='hidden md:block text-left text-3xl font-bold'>
					{ header && `${header} - `}한국 디스코드 리스트
				</h1>
				<h1 className='md:hidden text-center text-3xl font-semibold'>
					{ header && <span className='text-4xl'>{header}<br/></span>}한국 디스코드 리스트
				</h1>
				<p className='text-center sm:text-left text-xl font-base mt-2'>{description || `${type !== 'all' ? '다양한 ' : ''}국내 디스코드${{ all: '의 모든 것을', bots: ' 봇들을', servers: ' 서버들을' }[type]} 한 곳에서 확인하세요!`}</p>
				<Search />
				<div className='flex flex-wrap mt-5'>
					{
						type === 'all' ? <>
							<Tag text={
								<>
									<i className='fas fa-robot text-koreanbots-blue'/> 봇 리스트
								</>
							} dark bigger href='/bots' />
							<Tag text={
								<>
									<i className='fas fa-users text-koreanbots-blue'/> 서버 리스트
								</>
							} dark bigger href='/servers' />
							{
								botCategories.slice(0, 2).map(t => <Tag key={t} text={<><i className={botCategoryIcon[t]} /> {t} 봇</>} dark bigger href={`/bots/categories/${t}`} />)
							}
							
							{
								serverCategories.slice(0, 2).map(t => <Tag key={t} text={<><i className={serverCategoryIcon[t]} /> {t} 서버</>} dark bigger href={`/bots/categories/${t}`} />)
							}
						</>: <>
							<Tag key='list' text={<>
								<i className='fas fa-heart text-red-600'/> 하트 랭킹
							</>} dark bigger href={type === 'bots' ? '/bots/list/votes' : '/servers/list/votes'} />
							{ (type === 'bots' ? botCategories : serverCategories).slice(0, 4).map(t=> <Tag key={t} text={<>
								<i className={(type === 'bots' ? botCategoryIcon : serverCategoryIcon)[t]} /> {t}
							</>} dark bigger href={`${link}/${t}`} />) }
							<Tag key='tag' text={<>
								<i className='fas fa-tag'/> 카테고리 더보기
							</>} dark bigger href={link} />
						</>
					}
				</div>
			</Container>
		</div>
	</>
}

interface HeroProps {
	type?: 'all' | 'bots' | 'servers'
  header?: string
  description?: string
}

export default Hero