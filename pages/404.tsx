import { NextPage } from 'next'
import { ErrorText } from '@utils/Constants'

const NotFound: NextPage<{ message?: string }> = ({ message }) => {
	return (
		<div className='flex h-screen select-none items-center justify-center text-center'>
			<div>
				<div className='flex flex-row justify-center text-9xl'>
					4
					<img
						alt='robot'
						src='https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f916.svg'
						className='mx-6 w-24 rounded-full md:mx-12'
					/>
					4
				</div>
				<h2 className='text-2xl font-semibold'>{message || ErrorText[404]}</h2>
			</div>
		</div>
	)
}

export default NotFound
