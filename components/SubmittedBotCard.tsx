import { Status } from '@utils/Constants'

import Tag from './Tag'

import { SubmittedBot } from '@types'
import Link from 'next/link'

const SubmittedBotCard = ({ href, submit }:SubmittedBotProps):JSX.Element => {
	return <Link href={href}>
		<a className='relative mx-auto w-full h-full text-black dark:text-white dark:bg-discord-black bg-little-white rounded-2xl shadow-xl px-4 py-5 transform hover:-translate-y-1 transition duration-100 ease-in'>
			<div className='flex h-32'>
				<div className='flex-grow'>
					<h2 className='text-lg'>{submit.id}</h2>
					<p className='text-left text-gray-400 text-sm font-medium mt-1.5 h-6'>{submit.intro}</p>
				</div>
				<div className='grid grid-cols-1 px-4 w-2/5 h-0 absolute right-0'>
					<Tag
						text={
							<>
								<i className={`fas fa-circle text-${[Status.offline, Status.online, Status.dnd][submit.state]?.color}`} />
								{' '}{['대기중', '승인됨', '거부됨'][submit.state]}
							</>
						}
						dark
					/>
				</div>
			</div>
		</a>
	</Link>
}

interface SubmittedBotProps {
	href: string
  submit: SubmittedBot
}
export default SubmittedBotCard