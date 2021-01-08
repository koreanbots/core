import { Bot } from '../types'
import { formatNumber } from '../utils/Tools'
import { Status } from '../utils/Constants'
import Divider from './Divider'
import Tag from './Tag'

const BotCard = ({ bot }:BotProps):JSX.Element => {
	return <div className='container mb-20'>
		<div className="relative h-80">
			<div className="container mx-auto h-full">
				<div className='h-full'>

					<div className="flex bg-little-white dark:bg-discord-black text-black dark:text-white rounded-sm relative shadow-xl mx-auto h-full">
						<div className='w-2/3'>
							<div className="flex justify-start">
								<img src={bot.avatar ? `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=1024` : `https://cdn.discordapp.com/embed/avatars/${Number(bot.tag) % 5}.png?size=1024`} alt="" className="mx-auto absolute -top-16 -left-2 w-32 h-32 bg-white" />
							</div>
                
							<div className="mt-20 px-4">
								<h2 className='px-1 text-sm'><i className={`fas fa-circle text-${Status[bot.status]?.color}`}/>{Status[bot.status]?.text}</h2>
								<h1 className="font-bold text-left text-3xl mb-3">{bot.name} {bot.trusted && <span className='text-green-500 text-3xl'><i className='fas fa-award' /></span>}</h1>
								<p className="text-left text-sm text-gray-400 font-medium">{bot.intro}</p>
								{/* <div className="flex justify-evenly my-5">
								<a href="" className="bg font-bold text-sm text-blue-800 w-full text-center py-3 hover:bg-blue-800 hover:text-white hover:shadow-lg">Facebook</a>
								<a href="" className="bg font-bold text-sm text-blue-400 w-full text-center py-3 hover:bg-blue-400 hover:text-white hover:shadow-lg">Twitter</a>
								<a href="" className="bg font-bold text-sm text-yellow-600 w-full text-center py-3 hover:bg-yellow-600 hover:text-white hover:shadow-lg">Instagram</a>
								<a href="" className="bg font-bold text-sm text-gray-600 w-full text-center py-3 hover:bg-gray-600 hover:text-white hover:shadow-lg">Email</a>
							</div> */}
							</div>
						</div>
						<div className='grid grid-cols-1 w-1/3 py-5 h-0 pr-5'>
							<Tag text={<><i className='fas fa-heart text-red-600' /> {formatNumber(bot.votes)}</>} dark/>
							<Tag blurple text={<>{formatNumber(bot.servers)} 서버</>} dark/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
}

interface BotProps {
  bot: Bot
}

export default BotCard
