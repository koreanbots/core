import Link from 'next/link'
import DiscordAvatar from './DiscordAvatar'

const Application = ({ type, id, name }:ApplicationProps):JSX.Element => {
	return <Link href={`/developers/applications/${type+'s'}/${id}`}>
		<div className='relative py-4 px-2 bg-little-white dark:bg-discord-black text-center transform hover:-translate-y-1 transition duration-100 ease-in cursor-pointer rounded-lg'>
			<DiscordAvatar userID={id} className='w-full rounded-lg px-2' />
			<h2 className='text-xl font-bold pt-2'>{name.slice(0, 7)}{name.length > 7 && '...'}</h2>
		</div>
	</Link>
}

interface ApplicationProps {
  type: 'bot'
  id: string
  name: string
}

export default Application