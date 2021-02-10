import { Bot } from '../types'
import { formatNumber, makeBotURL } from '@utils/Tools'
import { Status } from '@utils/Constants'
import Divider from './Divider'
import Tag from './Tag'
import Link from 'next/link'
import DiscordAvatar from './DiscordAvatar'

const BotCard = ({ manage=false, bot }: BotProps): JSX.Element => {
	return (
		<div className='container mb-16'>
			<div className='relative'>
				<div className='container mx-auto'>
					<div className='h-full'>
						<div className='relative mx-auto h-full text-black dark:text-white dark:bg-discord-black bg-little-white rounded-2xl shadow-xl'>
							<div className='flex h-44'>
								<div className='w-2/3'>
									<div className='flex justify-start'>
										<DiscordAvatar size={128} userID={bot.id} alt='Avatar' 	className='rounded-full absolute -left-2 -top-8 mx-auto w-32 h-32 bg-white'/> 
									</div>

									<div className='mt-28 px-4'>
										<h2 className='px-1 text-sm'>
											<i className={`fas fa-circle text-${Status[bot.status]?.color}`} />
											{Status[bot.status]?.text}
										</h2>
										<h1 className='mb-3 text-left text-2xl font-bold truncate'>
											{bot.name}
										</h1>
									</div>
								</div>
								<div className='grid grid-cols-1 pr-5 py-5 w-1/3 h-0'>
									<Tag
										text={
											<>
												<i className='fas fa-heart text-red-600' /> {formatNumber(bot.votes)}
											</>
										}
										dark
									/>
									<Tag blurple text={<>{formatNumber(bot.servers)} 서버</>} dark />
								</div>
							</div>
							<p className='px-4 text-left text-gray-400 text-sm font-medium mb-10 h-6'>{bot.intro}</p>
							<div className='category px-2 flex flex-wrap'>
								{bot.category.slice(0, 5).map(el => (
									<Tag key={el} text={el} href={`/categories/${el}`} dark/>
								))}
							</div>
							<Divider />
							<div className='flex justify-evenly'>
								<Link
									href={makeBotURL(bot)}
								>
									<a className='rounded-bl-2xl py-3 w-full text-center text-koreanbots-blue hover:text-white text-sm font-bold hover:bg-koreanbots-blue hover:shadow-lg transition duration-100 ease-in'>
										보기
									</a>
								</Link>
								{
									manage ? <Link href={`/manage/${bot.id}`}>
										<a
											className='rounded-br-2xl py-3 w-full text-center text-green-500 hover:text-white text-sm font-bold hover:bg-green-500 hover:shadow-lg transition duration-100 ease-in'
										>
									관리하기
										</a>
									</Link> : <a
										rel='noopener noreferrer'
										target='_blank'
										href={
											bot.url ??
										`https://discordapp.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=0`
										}
										className='rounded-br-2xl py-3 w-full text-center text-discord-blurple hover:text-white text-sm font-bold hover:bg-discord-blurple hover:shadow-lg transition duration-100 ease-in'
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
	)
}

interface BotProps {
	manage?: boolean
	bot: Bot
}

export default BotCard
