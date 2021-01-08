import { NextPage } from 'next'
import Container from '../components/Container'
import Wave from '../components/Wave'

const Index: NextPage = () => {
	return (
		<>
			<div className="dark:bg-discord-black bg-discord-blurple">
				<Container className="pb-28 pt-20" ignoreColor>
					<h1 className="text-center text-gray-100 text-3xl font-bold sm:text-left">
						한국 디스코드봇 리스트
					</h1>
				</Container>
			</div>
			<Wave
				color="currentColor"
				className="dark:text-discord-black text-discord-blurple dark:bg-discord-dark bg-white"
			/>

			<Container>
				<h1 className="text-3xl font-bold">
					<i className="far fa-heart mr-3 text-pink-600" /> 하트 랭킹
				</h1>
				<p className="text-base">하트를 많이 받은 봇들의 순위입니다!</p>
				<h1 className="text-3xl font-bold">
					<i className="far fa-star mr-3 mt-10 text-yellow-500" /> 새로운 봇
				</h1>
				<p className="text-base">최근에 한국 디스코드봇 리스트에 추가된 따끈따끈한 봇입니다.</p>
				<h1 className="text-3xl font-bold">
					<i className="fa fa-check mr-3 mt-10 text-green-500" /> 신뢰된 봇
				</h1>
				<p className="text-base">KOREANBOTS에서 인증받은 신뢰할 수 있는 봇들입니다!!</p>
			</Container>
		</>
	)
}

export default Index
