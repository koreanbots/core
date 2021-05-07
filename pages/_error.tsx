import { NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getRandom } from '@utils/Tools'
import { ErrorMessage } from '@utils/Constants'

const Container = dynamic(() => import('@components/Container'))

const MyError: NextPage = () => {
	return <div
		className='flex items-center h-screen select-none px-20'
	>
		<Container>
			<h2 className='text-4xl font-semibold'>{getRandom(ErrorMessage)}</h2>
			<p className='text-md mt-1'>예상치 못한 오류가 발생하였습니다. 문제가 지속적으로 발생한다면 문의해주세요!</p>
			<a className='text-sm text-blue-500 hover:text-blue-400' href='https://status.koreanbots.dev' target='_blank' rel='noreferrer'>상태 페이지</a>
			<div>
				<Link href='/discord'>
					<a target='_blank' rel='noreferrer' className='text-lg hover:opacity-80 cursor-pointer'>
						<i className='fab fa-discord' />
					</a>
				</Link>
				<a href='https://twitter.com/koreanbots' target='_blank' rel='noreferrer' className='text-lg ml-2 hover:opacity-80 cursor-pointer'>
					<i className='fab fa-twitter' />
				</a>
			</div>
		</Container>
	</div>
}

export default MyError