import Link from 'next/link'
import dynamic from 'next/dynamic'

import { checkServerFlag, formatNumber, makeServerURL } from '@utils/Tools'
import { ServerData, ServerState } from '@types'
import { DiscordEnpoints, DSKR_BOT_ID } from '@utils/Constants'

const Divider = dynamic(() => import('@components/Divider'))
const Tag = dynamic(() => import('@components/Tag'))
const ServerIcon = dynamic(() => import('@components/ServerIcon'))

const ServerCard: React.FC<BotCardProps> = ({ type, server }) => {
	const newServerLink = server.data
		? `/addserver/${server.id}`
		: `${DiscordEnpoints.InviteApplication(
				DSKR_BOT_ID,
				{},
				'bot',
				null,
				server.id
		  )}&disable_guild_select=true`
	return (
		<div className='container mb-16 min-w-0 transform cursor-pointer transition duration-100 ease-in hover:-translate-y-1'>
			<div className='relative'>
				<div className='container mx-auto'>
					<div className='h-full'>
						<div
							className='relative mx-auto h-full rounded-2xl bg-little-white text-black shadow-xl dark:bg-discord-black dark:text-white'
							style={
								(checkServerFlag(server.flags, 'trusted') ||
									checkServerFlag(server.flags, 'partnered')) &&
								server.banner
									? {
											background: `linear-gradient(to right, rgba(34, 36, 38, 0.68), rgba(34, 36, 38, 0.68)), url("${server.banner}") center top / cover no-repeat`,
											color: 'white',
									  }
									: {}
							}
						>
							<Link href={type !== 'add' ? makeServerURL(server) : newServerLink} legacyBehavior>
								<div>
									<div className='flex flex-col'>
										<div className='flex'>
											<div className='flex w-3/5 justify-start'>
												<ServerIcon
													size={128}
													id={server.id}
													hash={server.icon}
													alt='Icon'
													className='absolute -left-2 -top-8 mx-auto h-32 w-32 rounded-full bg-white'
												/>
											</div>
											<div className='grid w-2/5 grid-cols-1 pr-5 pt-5'>
												<Tag
													text={
														<>
															<i className='fas fa-heart text-red-600' />{' '}
															{formatNumber(server.votes)}
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
										<div className='mt-3 h-16 px-4'>
											<h2
												className={`px-1 text-sm ${
													server.state !== 'unreachable' ? ' invisible' : ''
												}`}
											>
												<i className='fas fa-ban text-red-600' />
												정보 갱신 불가
											</h2>
											<h1 className='mb-3 truncate text-left text-xl font-bold sm:text-2xl'>
												{server.name}
											</h1>
										</div>
									</div>

									<p className='font mb-10 h-6 px-4 text-left text-sm text-gray-400'>
										{type === 'add'
											? server.data
												? '지금 바로 서버를 등록할 수 있습니다.'
												: '봇을 초대해야 서버를 등록할 수 있습니다.'
											: server.intro}
									</p>
									<div>
										<div className='category flex flex-wrap px-2'>
											{server.category
												?.slice(0, 3)
												.map((el) => (
													<Tag key={el} text={el} href={`/servers/categories/${el}`} dark />
												))}{' '}
											{server.category?.length > 3 && (
												<Tag text={`+${server.category.length - 3}`} dark />
											)}
										</div>
									</div>
								</div>
							</Link>
							<Divider />
							<div className='w-full'>
								<div className='flex justify-evenly'>
									{type === 'add' ? (
										server.data ? (
											<Link
												href={newServerLink}
												className='w-full rounded-b-2xl py-3 text-center text-sm font-bold text-emerald-500 transition duration-100 ease-in hover:bg-emerald-500 hover:text-white hover:shadow-lg'
											>
												등록하기
											</Link>
										) : (
											<Link
												href={newServerLink}
												className='w-full rounded-b-2xl py-3 text-center text-sm font-bold text-discord-blurple transition duration-100 ease-in hover:bg-discord-blurple hover:text-white hover:shadow-lg'
												rel='noopener noreferrer'
												target='_blank'
											>
												봇 초대하기
											</Link>
										)
									) : (
										<>
											<Link
												href={makeServerURL(server)}
												className='w-full rounded-bl-2xl py-3 text-center text-sm font-bold text-koreanbots-blue transition duration-100 ease-in hover:bg-koreanbots-blue hover:text-white hover:shadow-lg'
											>
												보기
											</Link>
											{type === 'manage' ? (
												<Link
													href={`/servers/${server.id}/edit`}
													className='w-full rounded-br-2xl py-3 text-center text-sm font-bold text-emerald-500 transition duration-100 ease-in hover:bg-emerald-500 hover:text-white hover:shadow-lg'
												>
													관리하기
												</Link>
											) : !['ok', 'unreachable'].includes(server.state) ? (
												<a className='w-full cursor-default select-none rounded-br-2xl py-3 text-center text-sm font-bold text-discord-blurple opacity-50 transition duration-100 ease-in hover:shadow-lg'>
													참가하기
												</a>
											) : (
												<a
													href={makeServerURL(server) + '/join'}
													rel='noopener noreferrer'
													target='_blank'
													className='w-full rounded-br-2xl py-3 text-center text-sm font-bold text-discord-blurple transition duration-100 ease-in hover:bg-discord-blurple hover:text-white hover:shadow-lg'
												>
													참가하기
												</a>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

interface BotCardProps {
	type: 'list' | 'manage' | 'add'
	server: {
		id: string
		name: string
		intro?: string
		desc?: string
		flags?: number
		state?: ServerState
		icon: string | null
		banner?: string | null
		bg?: string | null
		vanity?: string | null
		category?: string[]
		votes?: number | null
		members?: number | null
		data?: ServerData
	}
}

export default ServerCard
