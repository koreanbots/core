import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import { categories, categoryIcon } from '@utils/Constants'

const Container = dynamic(() => import('@components/Container'))
const Tag = dynamic(() => import('@components/Tag'))
const Segment = dynamic(() => import('@components/Segment'))

const Categories:NextPage = () => {
	return <Container paddingTop>
		<h1 className='text-2xl font-bold mb-5'>전체 카테고리</h1>
		<Segment>
			<div className='text-center flex flex-wrap mt-1.5'>
				{
					categories.map(t => <Tag key={t} text={<>
						<i className={categoryIcon[t]} /> {t}
					</>} href={`/categories/${t}`} dark bigger /> )
				}
			</div>
		</Segment>
	</Container>
}

export default Categories