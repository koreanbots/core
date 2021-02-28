import Link from 'next/link'
import DiscordAvatar from './DiscordAvatar'

const Application = ({ type, id, name }: ApplicationProps): JSX.Element => {
	return (
		<Link href={`/developers/applications/${type + 's'}/${id}`}>
			<div className='relative px-2 py-4 text-center dark:bg-discord-black bg-little-white rounded-lg cursor-pointer transform hover:-translate-y-1 transition duration-100 ease-in'>
				<DiscordAvatar userID={id} className='px-2 w-full rounded-xl' />
				<h2 className='pt-2 whitespace-nowrap text-xl font-medium truncate'>{name}</h2>
			</div>
		</Link>
	)
}

interface ApplicationProps {
	type: 'bot'
	id: string
	name: string
}

export default Application
