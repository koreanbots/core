import Link from 'next/link'
import dynamic from 'next/dynamic'

import { camoUrl, checkBotFlag, formatNumber, makeBotURL } from '@utils/Tools'
import { Status } from '@utils/Constants'
import { Bot } from '@types'

const Divider = dynamic(() => import('@components/Divider'))
const Tag = dynamic(() => import('@components/Tag'))
const DiscordAvatar = dynamic(() => import('@components/DiscordAvatar'))

const BotCard: React.FC<BotCardProps> = ({ manage = false, bot }) => {
	return (
		<div className='container mb-16 min-w-0 transform cursor-pointer transition duration-100 ease-in hover:-translate-y-1'>
			<div className='relative'>
				<div className='container mx-auto'>
					<div className='h-full'>
						<div
							className='relative mx-auto h-full rounded-2xl bg-little-white text-black shadow-xl dark:bg-discord-black dark:text-white'
							style={
								(checkBotFlag(bot.flags, 'trusted') || checkBotFlag(bot.flags, 'partnered')) && bot.banner
									? {
											background: `linear-gradient(to right, rgba(34, 36, 38, 0.68), rgba(34, 36, 38, 0.68)), url("${camoUrl(bot.banner)}") center top / cover no-repeat`,
											color: 'white',
									  }
									: {}
							}
						>
							<Link href={makeBotURL(bot)} legacyBehavior>
								<div>
									<div className='flex flex-col'>
										<div className='flex'>
											<div className='flex w-3/5 justify-start'>
												<DiscordAvatar
													size={128}
													userID={bot.id}
													hash={bot.avatar}
													alt='Avatar'
													className='absolute -left-2 -top-8 mx-auto h-32 w-32 rounded-full bg-white'
												/>
											</div>
											<div className='grid w-2/5 grid-cols-1 pr-5 pt-5'>
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
									</div>
									<div className='mt-3 h-16 px-4'>
										<h2 className='px-1 text-sm'>
											<i className={`fas fa-circle text-${Status[bot.status]?.color}`} />
											{Status[bot.status]?.text}
										</h2>
										<h1 className='mb-3 truncate text-left text-xl font-bold sm:text-2xl'>
											{bot.name}
										</h1>
									</div>
									<p className='mb-10 h-6 px-4 text-left text-sm text-gray-400'>{bot.intro}</p>
									<div>
										<div className='category flex flex-wrap px-2'>
											{bot.category.slice(0, 3).map((el) => (
												<Tag key={el} text={el} href={`/bots/categories/${el}`} dark />
											))}{' '}
											{bot.category.length > 3 && <Tag text={`+${bot.category.length - 3}`} dark />}
										</div>
									</div>
								</div>
							</Link>
							<Divider />
							<div className='w-full'>
								<div className='flex justify-evenly'>
									<Link
										href={makeBotURL(bot)}
										className='w-full rounded-bl-2xl py-3 text-center text-sm font-bold text-koreanbots-blue transition duration-100 ease-in hover:bg-koreanbots-blue hover:text-white hover:shadow-lg'
									>
										보기
									</Link>
									{manage ? (
										<Link
											href={`/bots/${bot.id}/edit`}
											className='w-full rounded-br-2xl py-3 text-center text-sm font-bold text-emerald-500 transition duration-100 ease-in hover:bg-emerald-500 hover:text-white hover:shadow-lg'
										>
											관리하기
										</Link>
									) : bot.state !== 'ok' ? (
										<a className='w-full cursor-default select-none rounded-br-2xl py-3 text-center text-sm font-bold text-discord-blurple opacity-50 transition duration-100 ease-in hover:shadow-lg'>
											초대하기
										</a>
									) : (
										<a
											href={makeBotURL(bot) + '/invite'}
											rel='noopener noreferrer'
											target='_blank'
											className='w-full rounded-br-2xl py-3 text-center text-sm font-bold text-discord-blurple transition duration-100 ease-in hover:bg-discord-blurple hover:text-white hover:shadow-lg'
										>
											초대하기
										</a>
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
	manage?: boolean
	bot: Bot
}

export default BotCard
