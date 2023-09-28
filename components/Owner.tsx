import Link from 'next/link'
import DiscordAvatar from '@components/DiscordAvatar'

const Owner: React.FC<OwnerProps> = ({ id, globalName, username, tag, crown=false }) => {
	return (
		(<Link
			href={`/users/${id}`}
			className='dark:hover:bg-discord-dark-hover flex mb-1 px-4 py-4 text-black dark:text-gray-400 text-base dark:bg-discord-black bg-little-white hover:bg-little-white-hover rounded cursor-pointer'>

			<div className='relative shrink-0 mr-3 mt-1 w-8 h-8 rounded-full shadow-inner overflow-hidden'>
				<DiscordAvatar userID={id} className='z-negative absolute inset-0 w-full h-full' />
			</div>
			<div className='flex-1 w-0 leading-snug'>
				<h4 className='whitespace-nowrap truncate'>{ crown && <i className='fas fa-crown text-amber-300 text-xs' /> }{tag === '0' ? globalName : username}</h4>
				<span className='text-gray-600 text-sm'>{tag === '0' ? '@' + username : '#' + tag}</span>
			</div>

		</Link>)
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
