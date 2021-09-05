import Link from 'next/link'
import dynamic from 'next/dynamic'

import { checkServerFlag, formatNumber, makeServerURL } from '@utils/Tools'
import { ServerData, ServerState } from '@types'
import { DiscordEnpoints, DSKR_BOT_ID } from '@utils/Constants'

const Divider = dynamic(() => import('@components/Divider'))
const Tag = dynamic(() => import('@components/Tag'))
const ServerIcon = dynamic(() => import('@components/ServerIcon'))

const ServerCard: React.FC<BotCardProps> = ({ type, server }) => {
	const newServerLink = server.data ? `/addserver/${server.id}` : `${DiscordEnpoints.InviteApplication(DSKR_BOT_ID, {}, 'bot', null, server.id)}&disable_guild_select=true`
	return	<div className='container mb-16 transform hover:-translate-y-1 transition duration-100 ease-in cursor-pointer'>
		<div className='relative'>
			<div className='container mx-auto'>
				<div className='h-full'>
					<div
						className='relative mx-auto h-full text-black dark:text-white dark:bg-discord-black bg-little-white rounded-2xl shadow-xl'
						style={
							checkServerFlag(server.flags, 'trusted') && server.banner
								? {
									background: `linear-gradient(to right, rgba(34, 36, 38, 0.68), rgba(34, 36, 38, 0.68)), url("${server.banner}") center top / cover no-repeat`,
									color: 'white',
								}
								: {}
						}
					>
						<Link href={type !== 'add' ? makeServerURL(server) : newServerLink}>
							<div>
								<div className='flex h-44'>
									<div className='w-3/5'>
										<div className='flex justify-start'>
											<ServerIcon
												size={128}
												id={server.id}
												hash={type === 'add' && server.icon}
												alt='Icon'
												className='absolute -left-2 -top-8 mx-auto w-32 h-32 bg-white rounded-full'
											/>
										</div>
									
										<div className='mt-28 px-4'>
											<h2 className={`px-1 text-sm ${server.state !== 'unreachable' ? ' invisible' : ''}`}>
												<i className='fas fa-ban text-red-600' />정보 갱신 불가
											</h2>
											<h1 className='mb-3 text-left text-2xl font-bold truncate'>{server.name}</h1>
										</div>
									</div>
									<div className='grid grid-cols-1 pr-5 py-5 w-2/5 h-0'>
										<Tag
											text={
												<>
													<i className='fas fa-heart text-red-600' /> {formatNumber(server.votes)}
												</>
											}
											dark
										/>
										<Tag
											blurple
											text={server.members ? <>{formatNumber(server.members)} 멤버</> : 'N/A'}
											dark
										/>
									</div>
								</div>
								
								<p className='mb-10 px-4 h-6 text-left text-gray-400 text-sm font-medium'>
									{type === 'add' ?
										server.data ? '지금 바로 서버를 등록할 수 있습니다.' : '봇을 초대해야 서버를 등록할 수 있습니다.'
										: server.intro
									}
								</p>
								<div>
									<div className='category flex flex-wrap px-2'>
										{server.category?.slice(0, 3).map(el => (
											<Tag key={el} text={el} href={`/servers/categories/${el}`} dark />
										))}{' '}
										{server.category?.length > 3 && <Tag text={`+${server.category.length - 3}`} dark />}
									</div>
								</div>
							</div>
						</Link>
						<Divider />
						<div className='w-full'>
							<div className='flex justify-evenly'>
								{
									type === 'add' ? 
										server.data ? <Link href={newServerLink}>
											<a className='py-3 w-full text-center text-green-500 hover:text-white text-sm font-bold hover:bg-green-500 rounded-b-2xl hover:shadow-lg transition duration-100 ease-in'>
												등록하기
											</a>
										</Link> : <Link href={newServerLink}>
											<a
												className='py-3 w-full text-center text-discord-blurple hover:text-white text-sm font-bold hover:bg-discord-blurple rounded-b-2xl hover:shadow-lg transition duration-100 ease-in'
												rel='noopener noreferrer'
												target='_blank'
											>
											봇 초대하기
											</a>
										</Link>
										:
										<>
											<Link href={makeServerURL(server)}>
												<a className='py-3 w-full text-center text-koreanbots-blue hover:text-white text-sm font-bold hover:bg-koreanbots-blue rounded-bl-2xl hover:shadow-lg transition duration-100 ease-in'>
										보기
												</a>
											</Link>
											{type === 'manage' ? (
												<Link href={`/servers/${server.id}/edit`}>
													<a className='py-3 w-full text-center text-green-500 hover:text-white text-sm font-bold hover:bg-green-500 rounded-br-2xl hover:shadow-lg transition duration-100 ease-in'>
											관리하기
													</a>
												</Link>
											) : !['ok', 'unreachable'].includes(server.state) ? <a
												className='py-3 w-full text-center text-discord-blurple text-sm font-bold rounded-br-2xl hover:shadow-lg transition duration-100 ease-in opacity-50 cursor-default select-none'
											>
												참가하기
											</a> : 
												<a
													href={
														makeServerURL(server) + '/join'
													}
													rel='noopener noreferrer'
													target='_blank'
													className='py-3 w-full text-center text-discord-blurple hover:text-white text-sm font-bold hover:bg-discord-blurple rounded-br-2xl hover:shadow-lg transition duration-100 ease-in'
												>
													참가하기
												</a>
											}
										</>
									
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

}

interface BotCardProps {
	type: 'list' | 'manage' | 'add'
	server: {
		id: string,
		name: string,
		intro?: string
		desc?: string,
		flags?: number
		state?: ServerState
		icon: string | null,
		banner?: string | null,
		bg?: string | null,
		vanity?: string | null
		category?: string[]
		votes?: number | null
		members?: number | null,
		data?: ServerData

	}
}

export default ServerCard