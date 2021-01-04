import { NextPage } from 'next'
import Container from '../components/Container'
import Wave from '../components/Wave'

const Index: NextPage = () => {
	return <>
		<div className='bg-discord-blurple dark:bg-discord-black'>
			<Container className='pt-20 pb-28'>
				<h1 className='text-3xl text-gray-100 font-bold sm:text-left text-center'>한국 디스코드봇 리스트</h1>
			</Container>
		</div>
		<Wave color='currentColor' className='text-discord-blurple dark:text-discord-black'/>
	</>
}

export default Index
