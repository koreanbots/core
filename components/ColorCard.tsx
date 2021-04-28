const ColorCard = ({ header, first, second, className }: ColorCardProps): JSX.Element => {
	return (
		<div className={`rounded-lg p-10 ${className} shadow-lg`}>
			<h2 className='text-2xl font-bold'>{header}</h2>
			<p className='opacity-80'>
				{first} 
				<br />
				{second}
			</p>
		</div>
	)
}

interface ColorCardProps {
	header: string
	first: string
	second: string
	className: string
}

export default ColorCard
