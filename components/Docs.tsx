import Container from './Container'
import Wave from './Wave'

const Docs = ({ header, description, subheader, children }: DocsProps): JSX.Element => {
	return (
		<>
			<div className='dark:bg-discord-black bg-discord-blurple'>
				<Container className='pb-28 pt-20' ignoreColor>
					<h1 className='mt-10 text-center text-gray-100 text-4xl font-bold sm:text-left'>
						{header}
					</h1>
					<h2 className='mt-5 text-center text-gray-200 text-2xl font-medium sm:text-left'>
						{description}
					</h2>
					<h2 className='mt-5 text-center text-gray-200 text-2xl font-medium sm:text-left'>
						{subheader}
					</h2>
				</Container>
			</div>
			<Wave
				color='currentColor'
				className='dark:text-discord-black text-discord-blurple dark:bg-discord-dark bg-white'
			/>
			<Container>
				<div>{children}</div>
			</Container>
		</>
	)
}

export default Docs

interface DocsProps {
	header: string
	description?: string
	subheader?: string
	children: JSX.Element | JSX.Element[]
}
