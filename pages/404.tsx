import { NextPage } from 'next'
import { ErrorText } from '@utils/Constants'

const NotFound: NextPage = () => {
	return (
		<div
			className='flex items-center justify-center h-screen md:flex-col'
			style={{
				background:
					'url("https://cdn.discordapp.com/attachments/745844596176715806/799149423505440768/1590927393326.jpg")',
			}}
		>
			<div className='text-center'>
				<h1 className='w-inline-block align-top m-0 py-10 text-4xl font-bold border-none md:mr-10 md:pr-10 md:border-r md:border-solid md:border-current'>
					404
				</h1>

				<h2 className='inline-block align-top m-0 py-10 text-2xl font-semibold md:text-4xl'>
					{ErrorText[404]}
				</h2>
			</div>
		</div>
	)
}

export default NotFound
