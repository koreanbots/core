const Segment = ({ children }:SegmentProps): JSX.Element => {
	return (
		<div className='p-5 text-black dark:text-white dark:bg-discord-black bg-little-white rounded-sm'>
			{children}
		</div>
	)
}

interface SegmentProps {
	children: JSX.Element | JSX.Element[]
}

export default Segment
