import dynamic from 'next/dynamic'
import Link from 'next/link'

const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const ServerIcon = dynamic(() => import('@components/ServerIcon'))

const Application: React.FC<ApplicationProps> = ({ type, id, name }) => {
	return (
		<Link href={`/developers/applications/${type + 's'}/${id}`} legacyBehavior>
			<div className='relative transform cursor-pointer rounded-lg bg-little-white px-2 py-4 text-center transition duration-100 ease-in hover:-translate-y-1 dark:bg-discord-black'>
				{type === 'bot' ? (
					<DiscordAvatar userID={id} className='w-full rounded-xl px-2' />
				) : (
					<ServerIcon id={id} className='w-full rounded-xl px-2' />
				)}
				<h2 className='truncate whitespace-nowrap pt-2 text-xl font-medium'>{name}</h2>
			</div>
		</Link>
	)
}

interface ApplicationProps {
	type: 'bot' | 'server'
	id: string
	name: string
}

export default Application
