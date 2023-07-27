const StatisticsCard: React.FC<StatisticsCardProps> = ({name, currentValue, diff, icon, range}) => {
	return <div className='text-black dark:text-white dark:bg-discord-black bg-little-white rounded-2xl shadow-xl p-5 hover:-translate-y-1 transition duration-100 ease-in cursor-pointer'>
		<p className='text-xl text-gray-400 font-semibold'>
			{name}
		</p>
		<div className='flex flex-row'>
			{icon}
			<p className='text-2xl text-center font-bold'>
				{currentValue}
			</p>
			<div className='w-1.5' />
			<p className={'text-base self-end text-semibold ' + (diff > 0 ? 'text-green-600' : diff == 0 ? 'text-gray-500' : 'text-red-600')}>
				{diff > 0 ? '+' : diff == 0 ? '-' : ''}{diff}
			</p>
		</div>
		<p className='text-lg text-gray-500 font-light'>
			{range === 'day' ? '어제 대비' : range === 'week' ? '저번주 대비' : range === 'month' ? '저번 달 대비' : range}
		</p>
	</div>
}

interface StatisticsCardProps {
    name: string
    currentValue: number | string
    diff: number
    icon: JSX.Element
    range: 'day' | 'week' | 'month' | string
}

export default StatisticsCard