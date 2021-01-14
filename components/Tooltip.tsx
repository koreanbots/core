import Link from 'next/link'

const Tooltip = ({ href, size='small', children, direction='center', text }:TooltipProps):JSX.Element => {
	return href ? <Link href={href}>
		<a className='inline'>
			<div className='relative py-3 inline'>
				<div className='group cursor-pointer relative inline-block text-center'>{children}
					<div className={`opacity-0 ${size==='small' ? 'w-44' : 'w-60'} bg-black text-white text-center text-xs rounded-lg py-2 px-3 absolute z-10 group-hover:opacity-100 bottom-full -left-4 pointer-events-none`}>
						{text}
						{
							direction === 'left' ? <svg className='absolute text-black h-2 left-5 mr-3 top-full' x='0px' y='0px' viewBox='0 0 255 255' xmlSpace='preserve'><polygon className='fill-current' points='0,0 127.5,127.5 255,0'/></svg>
								: direction === 'center' ?  <svg className='absolute text-black h-2 w-full left-0 top-full' x='0px' y='0px' viewBox='0 0 255 255' xmlSpace='preserve'><polygon className='fill-current' points='0,0 127.5,127.5 255,0'/></svg>
									: <svg className='absolute text-black h-2 right-5 mr-3 top-full' x='0px' y='0px' viewBox='0 0 255 255' xmlSpace='preserve'><polygon className='fill-current' points='0,0 127.5,127.5 255,0'/></svg>
						}
					</div>
				</div>
			</div>
		</a>
	</Link> : <a className='inline'>
		<div className='relative py-3 inline'>
			<div className='group cursor-pointer relative inline-block text-center'>{children}
				<div className={`opacity-0 ${size==='small' ? 'w-44' : 'w-60'} bg-black text-white text-center text-xs rounded-lg py-2 px-3 absolute z-10 group-hover:opacity-100 bottom-full -left-4 pointer-events-none`}>
					{text}
					{
						direction === 'left' ? <svg className='absolute text-black h-2 left-5 mr-3 top-full' x='0px' y='0px' viewBox='0 0 255 255' xmlSpace='preserve'><polygon className='fill-current' points='0,0 127.5,127.5 255,0'/></svg>
							: direction === 'center' ?  <svg className='absolute text-black h-2 w-full left-0 top-full' x='0px' y='0px' viewBox='0 0 255 255' xmlSpace='preserve'><polygon className='fill-current' points='0,0 127.5,127.5 255,0'/></svg>
								: <svg className='absolute text-black h-2 right-5 mr-3 top-full' x='0px' y='0px' viewBox='0 0 255 255' xmlSpace='preserve'><polygon className='fill-current' points='0,0 127.5,127.5 255,0'/></svg>
					}
				</div>
			</div>
		</div>
	</a>
}

interface TooltipProps {
  href?: string
  size?: 'small' | 'large'
  direction?: 'left' | 'center' | 'right'
  text: string
  children: JSX.Element | JSX.Element[]
}

export default Tooltip