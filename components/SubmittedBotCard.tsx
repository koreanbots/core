import { Status } from '@utils/Constants'

import Tag from '@components/Tag'

import { SubmittedBot } from '@types'
import Link from 'next/link'

const SubmittedBotCard = ({ href, submit }: SubmittedBotProps): JSX.Element => {
	return (
		<Link href={href}>
			<a className='relative mx-auto px-4 py-5 w-full h-full text-black dark:text-white dark:bg-discord-black bg-little-white rounded-2xl shadow-xl transform hover:-translate-y-1 transition duration-100 ease-in'>
				<div className='h-18'>
					<div className='flex'>
						<div className='flex-grow w-full'>
							<h2 className='text-lg'>{submit.id}</h2>
						</div>
						<div className='absolute right-0 grid grid-cols-1 px-4 w-2/5 h-0'>
							<Tag
								text={
									<>
										<i
											className={`fas fa-circle text-${
												[Status.offline, Status.online, Status.dnd][submit.state]?.color
											}`}
										/>{' '}
										{['대기중', '승인됨', '거부됨'][submit.state]}
									</>
								}
								dark
							/>
						</div>
					</div>
					<p className='mt-1.5 w-full h-6 text-left text-gray-400 text-sm font-medium truncate'>
						{submit.intro.slice(0, 25)}
						{submit.intro.length > 25 && '...'}
					</p>
				</div>
			</a>
		</Link>
	)
}

interface SubmittedBotProps {
	href: string
	submit: SubmittedBot
}
export default SubmittedBotCard
