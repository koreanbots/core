import Link from 'next/link'
import DiscordAvatar from './DiscordAvatar'

const Owner = ({ id, username, tag }:OwnerProps):JSX.Element => {
	return <Link href={`/users/${id}`}>
		<a className='text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 rounded flex hover:bg-little-white-hover dark:hover:bg-discord-dark-hover cursor-pointer px-4 py-4 mb-1'>
			<div className='rounded-full h-8 w-8 flex-shrink-0 mr-3 mt-1 overflow-hidden shadow-inner relative'>
				<DiscordAvatar userID={id} className='absolute inset-0 z-negative w-full h-full'/>
			</div> 
			<div className='flex-1 leading-snug w-0'>
				<h4 className='whitespace-nowrap'>{username}
				</h4><span className='text-sm text-gray-600'>#{tag}</span>
			</div>
		</a>
	</Link>
}

export default Owner

interface OwnerProps {
  id: string
  tag: string
  username: string
}