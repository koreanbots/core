import Link from 'next/link'

const Tooltip: React.FC<TooltipProps> = ({
	href,
	size = 'small',
	children,
	direction = 'center',
	text,
}) => {
	return href ? (
		<Link href={href} className='inline'>
			<div className='relative inline py-3'>
				<div className='group relative inline-block cursor-pointer text-center'>
					{children}
					<div
						className={`opacity-0 ${
							size === 'small' ? 'w-44' : 'w-60'
						} pointer-events-none absolute -left-4 bottom-full z-10 rounded-lg bg-black px-3 py-2 text-center text-xs text-white group-hover:opacity-100`}
					>
						{text}
						{direction === 'left' ? (
							<svg
								className='absolute left-5 top-full mr-3 h-2 text-black'
								x='0px'
								y='0px'
								viewBox='0 0 255 255'
								xmlSpace='preserve'
							>
								<polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
							</svg>
						) : direction === 'center' ? (
							<svg
								className='absolute left-0 top-full h-2 w-full text-black'
								x='0px'
								y='0px'
								viewBox='0 0 255 255'
								xmlSpace='preserve'
							>
								<polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
							</svg>
						) : (
							<svg
								className='absolute right-5 top-full mr-3 h-2 text-black'
								x='0px'
								y='0px'
								viewBox='0 0 255 255'
								xmlSpace='preserve'
							>
								<polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
							</svg>
						)}
					</div>
				</div>
			</div>
		</Link>
	) : (
		<a className='inline'>
			<div className='relative inline py-3'>
				<div className='group relative inline-block cursor-pointer text-center'>
					{children}
					<div
						className={`opacity-0 ${
							size === 'small' ? 'w-44' : 'w-60'
						} pointer-events-none absolute -left-4 bottom-full z-10 rounded-lg bg-black px-3 py-2 text-center text-xs text-white group-hover:opacity-100`}
					>
						{text}
						{direction === 'left' ? (
							<svg
								className='absolute left-5 top-full mr-3 h-2 text-black'
								x='0px'
								y='0px'
								viewBox='0 0 255 255'
								xmlSpace='preserve'
							>
								<polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
							</svg>
						) : direction === 'center' ? (
							<svg
								className='absolute left-0 top-full h-2 w-full text-black'
								x='0px'
								y='0px'
								viewBox='0 0 255 255'
								xmlSpace='preserve'
							>
								<polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
							</svg>
						) : (
							<svg
								className='absolute right-5 top-full mr-3 h-2 text-black'
								x='0px'
								y='0px'
								viewBox='0 0 255 255'
								xmlSpace='preserve'
							>
								<polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
							</svg>
						)}
					</div>
				</div>
			</div>
		</a>
	)
}

interface TooltipProps {
	href?: string
	size?: 'small' | 'large'
	direction?: 'left' | 'center' | 'right'
	text: string
	children: JSX.Element | JSX.Element[]
}

export default Tooltip
