import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'

const Container = dynamic(() => import('@components/Container'))

const Docs: React.FC<DocsProps> = ({ title, header, description, subheader, children }) => {
	const t = typeof header === 'string' ? header : title
	const d = description || subheader
	return (
		<>
			<NextSeo title={t} description={d}
				openGraph={{
					title: t,
					description: d
				}}
			/>
			<div className='dark:bg-discord-black bg-discord-blurple z-20'>
				<Container className='py-20' ignoreColor>
					<h1 className='mt-10 text-center text-gray-100 text-4xl font-bold sm:text-left'>
						{header}
					</h1>
					<h2 className='mt-5 text-center text-gray-200 text-xl font-medium sm:text-left'>
						{description}
					</h2>
					<h2 className='mt-5 text-center text-gray-200 text-xl font-medium sm:text-left'>
						{subheader}
					</h2>
				</Container>
			</div>
			<Container className='pt-10 pb-20'>
				<div>{children}</div>
			</Container>
		</>
	)
}

export default Docs

interface DocsProps {
	header: string | React.ReactNode
	title?: string
	description?: string
	subheader?: string
	children: React.ReactNode
}
