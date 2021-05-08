import Link from 'next/link'

import { checkBotFlag, formatNumber, makeBotURL } from '@utils/Tools'
import { Status } from '@utils/Constants'
import { Bot } from '@types'

import Divider from '@components/Divider'
import Tag from '@components/Tag'
import DiscordAvatar from '@components/DiscordAvatar'

const BotCard = ({ manage = false, bot }: BotProps): JSX.Element => {
	return (
		<div className='container mb-16 transform hover:-translate-y-1 transition duration-100 ease-in cursor-pointer'>
			<div className='relative'>
				<div className='container mx-auto'>
					<div className='h-full'>
						<div
							className='relative mx-auto h-full text-black dark:text-white dark:bg-discord-black bg-little-white rounded-2xl shadow-xl'
							style={
								checkBotFlag(bot.flags, 'trusted') && bot.banner
									? {
										background: `linear-gradient(to right, rgba(34, 36, 38, 0.68), rgba(34, 36, 38, 0.68)), url("${bot.banner}") center top / cover no-repeat`,
										color: 'white',
									}
									: {}
							}
						>
							<Link href={makeBotURL(bot)}>
								<div>
									<div className='flex h-44'>
										<div className='w-3/5'>
											<div className='flex justify-start'>
												<DiscordAvatar
													size={128}
													userID={bot.id}
													alt='Avatar'
													className='absolute -left-2 -top-8 mx-auto w-32 h-32 bg-white rounded-full'
												/>
											</div>

											<div className='mt-28 px-4'>
												<h2 className='px-1 text-sm'>
													<i className={`fas fa-circle text-${Status[bot.status]?.color}`} />
													{Status[bot.status]?.text}
												</h2>
												<h1 className='mb-3 text-left text-2xl font-bold truncate'>{bot.name}</h1>
											</div>
										</div>
										<div className='grid grid-cols-1 pr-5 py-5 w-2/5 h-0'>
											<Tag
												text={
													<>
														<i className='fas fa-heart text-red-600' /> {formatNumber(bot.votes)}
													</>
												}
												dark
											/>
											<Tag
												blurple
												text={bot.servers ? <>{formatNumber(bot.servers)} 서버</> : 'N/A'}
												dark
											/>
										</div>
									</div>
									<p className='mb-10 px-4 h-6 text-left text-gray-400 text-sm font-medium'>
										{bot.intro}
									</p>
									<div>
										<div className='category flex flex-wrap px-2'>
											{bot.category.slice(0, 3).map(el => (
												<Tag key={el} text={el} href={`/categories/${el}`} dark />
											))}{' '}
											{bot.category.length > 3 && <Tag text={`+${bot.category.length - 3}`} dark />}
										</div>
									</div>
								</div>
							</Link>
							<Divider />
							<div className='w-full'>
								<div className='flex justify-evenly'>
									<Link href={makeBotURL(bot)}>
										<a className='py-3 w-full text-center text-koreanbots-blue hover:text-white text-sm font-bold hover:bg-koreanbots-blue rounded-bl-2xl hover:shadow-lg transition duration-100 ease-in'>
										보기
										</a>
									</Link>
									{manage ? (
										<Link href={`/manage/${bot.id}`}>
											<a className='py-3 w-full text-center text-green-500 hover:text-white text-sm font-bold hover:bg-green-500 rounded-br-2xl hover:shadow-lg transition duration-100 ease-in'>
											관리하기
											</a>
										</Link>
									) : bot.state !== 'ok' ? <a
										className='py-3 w-full text-center text-discord-blurple text-sm font-bold rounded-br-2xl hover:shadow-lg transition duration-100 ease-in opacity-50 cursor-default select-none'
									>
								초대하기
									</a> : 
										<a
											href={
												bot.url ||	
									`https://discordapp.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=0`
											}
											rel='noopener noreferrer'
											target='_blank'
											className='py-3 w-full text-center text-discord-blurple hover:text-white text-sm font-bold hover:bg-discord-blurple rounded-br-2xl hover:shadow-lg transition duration-100 ease-in'
										>
									초대하기
										</a>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

interface BotProps {
	manage?: boolean
	bot: Bot
}

export default BotCard