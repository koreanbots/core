import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import { categories, categoryIcon } from '@utils/Constants'

const Container = dynamic(() => import('@components/Container'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Tag = dynamic(() => import('@components/Tag'))
const SEO = dynamic(() => import('@components/SEO'))
const Segment = dynamic(() => import('@components/Segment'))

const Categories:NextPage = () => {
	return <Container paddingTop>
		<SEO title='전체 카테고리' description='한국 디스코드봇 리스트의 전체 카테고리입니다.'/>
		<h1 className='text-2xl font-bold mt-2 mb-5'>전체 카테고리</h1>
		<Segment>
			<div className='text-center flex flex-wrap mt-1.5'>
				{
					categories.map(t => <Tag key={t} text={<>
						<i className={categoryIcon[t]} /> {t}
					</>} href={`/categories/${t}`} dark bigger /> )
				}
			</div>
		</Segment>
		<Advertisement />
	</Container>
}

export default Categories