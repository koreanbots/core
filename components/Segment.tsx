import { ReactNode } from 'react'

const Segment: React.FC<SegmentProps> = ({ children, className = '' }) => {
	return (
		<div
			className={`rounded bg-little-white px-7 py-3 text-black dark:bg-discord-black dark:text-white ${className}`}
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
