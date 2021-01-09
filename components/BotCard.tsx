import { Bot } from '../types'
import { formatNumber } from '../utils/Tools'
import { Status } from '../utils/Constants'
import Divider from './Divider'
import Tag from './Tag'
import Link from 'next/link'

const BotCard = ({ bot }: BotProps): JSX.Element => {
	console.log(`${bot.vanity}`)
	return (
		<div className="container mb-20">
			<div className="relative">
				<div className="container mx-auto">
					<div className="h-full">
						<div className="relative mx-auto h-full text-black dark:text-white dark:bg-discord-black bg-little-white rounded-sm shadow-xl">
							<div className="flex mb-16 h-48">
								<div className="w-2/3">
									<div className="flex justify-start">
										<img
											alt="Avatar"
											src={
												bot.avatar
													? `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=1024`
													: `https://cdn.discordapp.com/embed/avatars/${Number(bot.tag) %
															5}.png?size=1024`
											}
											className="absolute -left-2 -top-8 mx-auto w-32 h-32 bg-white"
										/>
									</div>

									<div className="mt-28 px-4">
										<h2 className="px-1 text-sm">
											<i className={`fas fa-circle text-${Status[bot.status]?.color}`} />
											{Status[bot.status]?.text}
										</h2>
										<h1 className="mb-3 text-left text-3xl font-bold">
											{bot.name}{' '}
											{bot.trusted && (
												<span className="text-koreanbots-blue text-3xl">
													<i className="fas fa-award" />
												</span>
											)}
										</h1>
										<p className="text-left text-gray-400 text-sm font-medium">{bot.intro}</p>
									</div>
								</div>
								<div className="grid grid-cols-1 pr-5 py-5 w-1/3 h-0">
									<Tag
										text={
											<>
												<i className="fas fa-heart text-red-600" /> {formatNumber(bot.votes)}
											</>
										}
										dark
									/>
									<Tag blurple text={<>{formatNumber(bot.servers)} 서버</>} dark />
								</div>
							</div>
							<div className="category">
								{bot.category.slice(5).map(el => (
									<Tag key={el} text={el} href={`/categories/${el}`} />
								))}
							</div>
							<Divider />
							<div className="flex justify-evenly">
								<Link
									href={`/bots/${
										(bot.partnered || bot.trusted) && bot.vanity ? bot.vanity : bot.id
									}`}
								>
									<a className="bg py-3 w-full text-center text-koreanbots-blue hover:text-white text-sm font-bold hover:bg-koreanbots-blue hover:shadow-lg">
										보기
									</a>
								</Link>
								<a
									href="#"
									className="bg py-3 w-full text-center text-discord-blurple hover:text-white text-sm font-bold hover:bg-discord-blurple hover:shadow-lg"
								>
									초대하기
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

interface BotProps {
	bot: Bot
}

export default BotCard
