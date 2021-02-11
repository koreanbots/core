const Toggle = ({ checked, onChange }:ToggleProps):JSX.Element => {
	return <button className='relative inline-block w-10 mr-2 align-middle select-none outline-none' onClick={onChange} onKeyPress={onChange}>
		<input type='checkbox' checked={checked} className='absolute block w-6 h-6 rounded-full bg-white border-4 border-transparent appearance-none cursor-pointer outline-none checked:right-0' readOnly />
		<span className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${checked ? 'bg-koreanbots-blue' : ''}`}></span>
	</button>
}

interface ToggleProps {
  checked: boolean,
	onChange(): void
}

export default Toggle