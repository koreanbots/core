import { NextPage } from 'next'
import { ErrorText } from '@utils/Constants'

const NotFound: NextPage = () => {
	return (
		<div
			className='flex items-center justify-center h-screen select-none text-center'
		>
			<div>
				<div className='flex flex-row justify-center text-9xl'>
					4
					<img alt='robot' src='https://twemoji.maxcdn.com/v/13.0.1/svg/1f916.svg' className='w-24 mx-6 md:mx-12 rounded-full' />
					4
				</div>
				<h2 className='text-2xl font-semibold'>
					{ErrorText[404]}
				</h2>
			</div>
			
		</div>
	)
}

export default NotFound
