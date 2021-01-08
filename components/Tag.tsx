import Link from 'next/link'

const Tag = ({ href, text, circular=false, dark=false, marginBottom=2 }:LabelProps):JSX.Element => {
	return href ? <Link href={href}>
		<a className={`text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 ${circular ? 'rounded-3xl px-2.5 py-1.5' : 'rounded px-2 py-1'} mr-1 mb-${marginBottom} hover:bg-little-white-hover dark:hover:bg-discord-dark-hover`}>{text}</a>
	</Link> : <a className={`text-base ${dark ? 'bg-little-white-hover dark:bg-very-black' : 'bg-little-white dark:bg-discord-black'} text-black dark:text-gray-400 ${circular ? 'rounded-3xl px-2.5 py-1.5' : 'rounded px-2 py-1'} mr-1 mb-${marginBottom}`}>{text}</a>
}

interface LabelProps {
  href?: string
  text: string | JSX.Element | JSX.Element[]
  icon?: string
  circular?: boolean
  dark?: boolean
  marginBottom?: number
}

export default Tag