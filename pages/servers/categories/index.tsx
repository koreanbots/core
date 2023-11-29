import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'

import { serverCategories, serverCategoryIcon } from '@utils/Constants'

const Container = dynamic(() => import('@components/Container'))
const Advertisement = dynamic(() => import('@components/Advertisement'))
const Tag = dynamic(() => import('@components/Tag'))
const Segment = dynamic(() => import('@components/Segment'))

const Categories: NextPage = () => {
	return (
		<Container paddingTop>
			<NextSeo
				title='전체 카테고리'
				description='한국 디스코드 리스트 서버들의 전체 카테고리입니다.'
			/>
			<h1 className='mb-5 mt-2 text-2xl font-bold'>전체 카테고리</h1>
			<Segment className='mb-10'>
				<div className='mt-1.5 flex flex-wrap text-center'>
					{serverCategories.map((t) => (
						<Tag
							key={t}
							text={
								<>
									<i className={serverCategoryIcon[t]} /> {t}
								</>
							}
							href={`/servers/categories/${t}`}
							dark
							bigger
						/>
					))}
				</div>
			</Segment>
			<Advertisement />
		</Container>
	)
}

export default Categories
