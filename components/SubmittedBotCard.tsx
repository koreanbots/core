import { Status } from '@utils/Constants'

import Tag from '@components/Tag'

import { SubmittedBot } from '@types'
import Link from 'next/link'

const SubmittedBotCard: React.FC<SubmittedBotProps> = ({ href, submit }) => {
	return (
		<Link
			href={href}
			className='relative mx-auto h-full w-full transform rounded-2xl bg-little-white px-4 py-5 text-black shadow-xl transition duration-100 ease-in hover:-translate-y-1 dark:bg-discord-black dark:text-white'
		>
			<div className='h-18'>
				<div className='flex'>
					<div className='w-full grow'>
						<h2 className='text-lg'>{submit.id}</h2>
					</div>
					<div className='absolute right-0 grid h-0 w-2/5 grid-cols-1 px-4'>
						<Tag
							text={
								<>
									<i
										className={`fas fa-circle text-${[Status.offline, Status.online, Status.dnd][
											submit.state
										]?.color}`}
									/>{' '}
									{['대기중', '승인됨', '거부됨'][submit.state]}
								</>
							}
							dark
						/>
					</div>
				</div>
				<p className='mt-1.5 h-6 w-full truncate text-left text-sm font-medium text-gray-400'>
					{submit.intro.slice(0, 25)}
					{submit.intro.length > 25 && '...'}
				</p>
			</div>
		</Link>
	)
}

interface SubmittedBotProps {
	href: string
	submit: SubmittedBot
}
export default SubmittedBotCard
