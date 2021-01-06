import Container from './Container'
import Wave from './Wave'

const Docs = ({ header, description, subheader, children }:DocsProps):JSX.Element => {
	return <>
		<div className='bg-discord-blurple dark:bg-discord-black'>
			<Container className='pt-20 pb-28' ignoreColor>
				<h1 className='mt-10 text-4xl text-gray-100 font-bold sm:text-left text-center'>{header}</h1>
        <h2 className='mt-5 text-2xl text-gray-200 font-medium sm:text-left text-center'>{description}</h2>
				<h2 className='mt-5 text-2xl text-gray-200 font-medium sm:text-left text-center'>{subheader}</h2>
			</Container>
		</div>
		<Wave color='currentColor' className='text-discord-blurple dark:text-discord-black bg-white dark:bg-discord-dark'/>
		<Container>
			<div>
				{children}
			</div>
		</Container>
	</>
}

export default Docs

interface DocsProps {
  header: string
  description?: string
  subheader?: string
  children: JSX.Element | JSX.Element[]
}