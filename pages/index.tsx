import { NextPage } from 'next'
import Container from '../components/Container'
import Wave from '../components/Wave'

const Index: NextPage = () => {
	return <>
		<div className='bg-discord-blurple dark:bg-discord-black'>
			<Container className='pt-20 pb-28' ignoreColor>
				<h1 className='text-3xl text-gray-100 font-bold sm:text-left text-center'>한국 디스코드봇 리스트</h1>
			</Container>
		</div>
		<Wave color='currentColor' className='text-discord-blurple dark:text-discord-black bg-white dark:bg-discord-dark'/>

		<Container>
			<h1 className='text-3xl font-bold'><i className='far fa-heart text-pink-600' /> 하트 랭킹</h1>
			<p className='text-base'>하트를 많이 받은 봇들의 순위입니다!</p>
			<h1 className='text-3xl font-bold'><i className='far fa-star text-yellow-500 mt-10' /> 새로운 봇</h1>
			<p className='text-base'>최근에 한국 디스코드봇 리스트에 추가된 따끈따끈한 봇입니다.</p>
			<h1 className='text-3xl font-bold'><i className='fa fa-check text-green-500 mt-10' /> 신뢰된 봇</h1>
			<p className='text-base'>KOREANBOTS에서 인증받은 신뢰할 수 있는 봇들입니다!!</p>
		</Container>
	</>
}

export default Index
