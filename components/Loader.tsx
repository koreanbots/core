const Loader = ({ text, visible=true }:LoaderProps):JSX.Element => {
	return <div className={`${visible ? '' : 'hidden '}w-full h-full fixed block top-0 left-0 bg-gray-500 bg-opacity-75 z-50 dark:text-black`}>
		<h1 className='text-2xl font-semibold opacity-100 top-1/2 my-0 mx-auto block relative text-center'>
			{ text }
		</h1>
	</div>
}

interface LoaderProps {
  text: string
  visible?: boolean
}

export default Loader