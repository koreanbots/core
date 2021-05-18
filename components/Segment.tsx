import { ReactNode } from 'react'

const Segment: React.FC<SegmentProps> = ({ children, className = '' }) => {
	return (
		<div
			className={`py-3 px-7 text-black dark:text-white dark:bg-discord-black bg-little-white rounded ${className}`}
		>
			{children}
		</div>
	)
}

interface SegmentProps {
	className?: string
	children: ReactNode
}

export default Segment
