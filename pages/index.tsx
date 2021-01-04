import { NextPage } from 'next'
import Container from '../components/Container'

const Index: NextPage = () => {
	return <>
		<div className='bg-discord-blurple dark:bg-discord-dark'>
			<Container className='py-28'>
				<h1 className='font-bold text-4xl text-gray-100 dark:text-discord-dark'>한국 디스코드봇 리스트</h1>
			</Container>
		</div>
	</>
}

export default Index
