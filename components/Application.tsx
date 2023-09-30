import dynamic from 'next/dynamic'
import Link from 'next/link'

const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))
const ServerIcon = dynamic(() => import('@components/ServerIcon'))

const Application: React.FC<ApplicationProps> = ({ type, id, name }) => {
	return <Link href={`/developers/applications/${type + 's'}/${id}`}>
		<div className='relative px-2 py-4 text-center dark:bg-discord-black bg-little-white rounded-lg cursor-pointer transform hover:-translate-y-1 transition duration-100 ease-in'>
			{
				type === 'bot' ?
					<DiscordAvatar userID={id} className='px-2 w-full rounded-xl' /> :
					<ServerIcon id={id} className='px-2 w-full rounded-xl' />
			}
			<h2 className='pt-2 whitespace-nowrap text-xl font-medium truncate'>{name}</h2>
		</div>
	</Link>

}

interface ApplicationProps {
	type: 'bot' | 'server'
	id: string
	name: string
}

export default Application
