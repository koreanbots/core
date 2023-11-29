const Toggle: React.FC<ToggleProps> = ({ checked, onChange }: ToggleProps) => {
	return (
		<button
			className='relative mr-2 inline-block w-10 select-none align-middle outline-none'
			onClick={onChange}
			onKeyPress={onChange}
		>
			<input
				type='checkbox'
				checked={checked}
				className='absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 border-transparent bg-white outline-none checked:right-0'
				readOnly
			/>
			<span
				className={`block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 ${
					checked ? 'bg-koreanbots-blue' : ''
				}`}
			></span>
		</button>
	)
}

interface ToggleProps {
	checked: boolean
	onChange(): void
}

export default Toggle
