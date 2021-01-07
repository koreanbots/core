import Link from 'next/link'
import DiscordImage from './DiscordImage'

const Owner = ({ id, username, tag, avatarHash }:OwnerProps):JSX.Element => {
	return <Link href={`/users/${id}`}>
		<div className="text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 rounded flex hover:bg-little-white-hover dark:hover:bg-discord-dark-hover cursor-pointer px-4 py-4 mb-1">
			<div className="rounded-full h-8 w-8 flex-shrink-0 mr-3 mt-1 overflow-hidden shadow-inner relative">
				<DiscordImage userID={id} tag={tag} avatarHash={avatarHash} className="absolute inset-0 z-negative w-full h-full" size={50} />
			</div> 
			<div className="flex-1 leading-snug w-0">
				<h4 className="whitespace-nowrap">{username}
				</h4><span className="text-sm text-gray-600">#{tag}</span>
			</div>
		</div>
		{/* <div className='text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 px-2 rounded mr-1 mb-3 hover:bg-little-white-hover dark:hover:bg-discord-dark-hover w-full py-5'>  
			<DiscordImage userID={id} tag={tag} avatarHash={avatarHash} className='rounded-full float-left mr-4 py-' size={30} />
			<span className='ml-3'>
				{username} <span className='text-gray-300 text-sm mt-2'>#{tag}</span>
			</span>
		</div> */}
	</Link>
}

export default Owner

interface OwnerProps {
  id: string
  tag: string
  avatarHash: string
  username: string
}