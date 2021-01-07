import Link from 'next/link'
import DiscordImage from './DiscordImage'

const Owner = ({ id, username, tag, avatarHash }:OwnerProps):JSX.Element => {
	return <Link href={`/users/${id}`}>
		<a className='text-base bg-little-white dark:bg-discord-black text-black dark:text-gray-400 px-2 py-1 rounded mr-1 mb-1 hover:bg-little-white-hover dark:hover:bg-discord-dark-hover flex'>
			<DiscordImage userID={id} tag={tag} avatarHash={avatarHash} className='rounded-full mr-4' size={30} />
			<div className='ml-3 py-2'>
				{username} <span className='text-gray-300 text-sm'>#{tag}</span>
			</div>
		</a>
	</Link>
}

export default Owner

interface OwnerProps {
  id: string
  tag: string
  avatarHash: string
  username: string
}