/* eslint-disable jsx-a11y/no-static-element-interactions */
import Link from 'next/link'

const LongButton = ({ children, newTab=false, href, onClick, center=false }:LongButtonProps):JSX.Element => {
	if(href) {
		if(newTab)  return <a href={href} rel='noopener noreferrer'
			target='_blank'>
			<div className={`${center ? 'justify-center ': '' }text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 rounded flex hover:bg-little-white-hover dark:hover:bg-discord-dark-hover cursor-pointer px-4 py-4 mb-1`}>
				{children}
			</div>
		</a>
		else  return <Link href={href}>
			<a className={`${center ? 'justify-center ': '' }text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 rounded flex hover:bg-little-white-hover dark:hover:bg-discord-dark-hover cursor-pointer px-4 py-4 mb-1`}>
				{children}
			</a>
		</Link>
	}
	if(onClick) return <div onKeyPress={onClick} onClick={onClick} className={`${center ? 'justify-center ': '' }text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 rounded flex hover:bg-little-white-hover dark:hover:bg-discord-dark-hover cursor-pointer px-4 py-4 mb-1`}>
		{children}
	</div>

	return <a  className={`${center ? 'justify-center ': '' }text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 rounded flex hover:bg-little-white-hover dark:hover:bg-discord-dark-hover cursor-pointer px-4 py-4 mb-1`}>
		{children}
	</a>

  

}

export default LongButton

interface LongButtonProps {
		newTab?: boolean
    onClick?: (event: React.KeyboardEvent<HTMLDivElement>|React.MouseEvent<HTMLDivElement>) => void
    children: string | JSX.Element | JSX.Element[]
		href?: string
		center?: boolean
}