import { NextPage } from 'next'
import { ErrorText } from '@utils/Constants'

const NotFound: NextPage = () => {
	return <div className='h-screen flex md:flex-col items-center justify-center' style={{ background: 'url("https://cdn.discordapp.com/attachments/745844596176715806/799149423505440768/1590927393326.jpg")' }}>
		<div className='text-center'>
			<h1 className='w-inline-block text-4xl font-bold align-top border-none md:border-r md:border-solid md:border-current m-0 md:mr-10 py-10 md:pr-10'>404</h1>

			<h2 className='inline-block text-2xl md:text-4xl font-semibold align-top m-0 py-10'>
				{ ErrorText[404] }
			</h2>
		</div>
	</div>
}

export default NotFound
