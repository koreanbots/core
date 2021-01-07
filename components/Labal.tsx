import Link from 'next/link'

const Label = ({ href, text }:LabelProps):JSX.Element => {
	return href ? <Link href={href}>
		<a className='text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 px-2 py-1 rounded mr-1 mb-1 hover:bg-little-white-hover dark:hover:bg-discord-dark-hover'>{text}</a>
	</Link> : <a className='text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 px-2 py-1 rounded mr-1 mb-1'>{text}</a>
}

interface LabelProps {
  href?: string
  text: string
  icon?: string
}

export default Label