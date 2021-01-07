const Segment = ({ children }):JSX.Element => {
	return <div className='bg-little-white dark:bg-discord-black text-black dark:text-white p-5 rounded-sm'>
		{children}
	</div>
}

export default Segment