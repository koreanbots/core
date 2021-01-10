const Segment = ({ children }): JSX.Element => {
	return (
		<div className='p-5 text-black dark:text-white dark:bg-discord-black bg-little-white rounded-sm'>
			{children}
		</div>
	)
}

export default Segment
