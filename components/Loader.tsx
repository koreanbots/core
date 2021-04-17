const Loader = ({ text, visible = true }: LoaderProps): JSX.Element => {
	return (
		<div
			className={`${
				visible ? '' : 'hidden '
			} w-full h-full fixed block top-0 left-0 bg-gray-500 bg-opacity-75 z-50 dark:text-black`}
		>
			<h1 className='relative top-1/2 block mx-auto my-0 text-center text-2xl font-semibold opacity-100'>
				{text}
			</h1>
		</div>
	)
}

interface LoaderProps {
	text: string | JSX.Element
	visible?: boolean
}

export default Loader
