const Toggle = ({ checked, onChange }: ToggleProps): JSX.Element => {
	return (
		<button
			className='relative inline-block align-middle mr-2 w-10 outline-none select-none'
			onClick={onChange}
			onKeyPress={onChange}
		>
			<input
				type='checkbox'
				checked={checked}
				className='absolute checked:right-0 block w-6 h-6 bg-white border-4 border-transparent rounded-full outline-none appearance-none cursor-pointer'
				readOnly
			/>
			<span
				className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
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
