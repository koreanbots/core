import Link from 'next/link'
import DiscordAvatar from '@components/DiscordAvatar'

const Owner: React.FC<OwnerProps> = ({ id, globalName, username, tag, crown = false }) => {
	return (
		<Link
			href={`/users/${id}`}
			className='mb-1 flex cursor-pointer rounded bg-little-white px-4 py-4 text-base text-black hover:bg-little-white-hover dark:bg-discord-black dark:text-gray-400 dark:hover:bg-discord-dark-hover'
		>
			<div className='relative mr-3 mt-1 h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-inner'>
				<DiscordAvatar userID={id} className='z-negative absolute inset-0 h-full w-full' />
			</div>
			<div className='w-0 flex-1 leading-snug'>
				<h4 className='truncate whitespace-nowrap'>
					{crown && <i className='fas fa-crown text-xs text-amber-300' />}
					{tag === '0' ? globalName : username}
				</h4>
				<span className='text-sm text-gray-600'>{tag === '0' ? '@' + username : '#' + tag}</span>
			</div>
		</Link>
	)
}

export default Owner

interface OwnerProps {
	id: string
	username: string
	tag: string
	globalName: string
	crown?: boolean
}
