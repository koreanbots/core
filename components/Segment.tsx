const Segment = ({ children }:SegmentProps): JSX.Element => {
	return (
		<div className='px-7 text-black dark:text-white dark:bg-discord-black bg-little-white rounded-sm'>
			{children}
		</div>
	)
}

interface SegmentProps {
	children: JSX.Element | JSX.Element[]
}

export default Segment
