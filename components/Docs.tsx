import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'

const Container = dynamic(() => import('@components/Container'))

const Docs: React.FC<DocsProps> = ({ title, header, description, subheader, children }) => {
	const t = typeof header === 'string' ? header : title
	const d = description || subheader
	return (
		<>
			<NextSeo
				title={t}
				description={d}
				openGraph={{
					title: t,
					description: d,
				}}
			/>
			<div className='z-20 bg-discord-blurple dark:bg-discord-black'>
				<Container className='py-20' ignoreColor>
					<h1 className='mt-10 text-center text-4xl font-bold text-gray-100 sm:text-left'>
						{header}
					</h1>
					<h2 className='mt-5 text-center text-xl font-medium text-gray-200 sm:text-left'>
						{description}
					</h2>
					<h2 className='mt-5 text-center text-xl font-medium text-gray-200 sm:text-left'>
						{subheader}
					</h2>
				</Container>
			</div>
			<Container className='pb-20 pt-10'>
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
