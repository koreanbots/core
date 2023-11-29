const Loader: React.FC<LoaderProps> = ({ text, visible = true }) => {
	return (
		<div
			className={`${
				visible ? '' : 'hidden '
			} fixed left-0 top-0 z-50 block h-full w-full bg-gray-500 bg-opacity-75 dark:text-black`}
		>
			<h1 className='relative top-1/2 mx-auto my-0 block text-center text-2xl font-semibold opacity-100'>
				{text}
			</h1>
		</div>
	)
}

interface LoaderProps {
	text: string | React.ReactNode
	visible?: boolean
}

export default Loader
