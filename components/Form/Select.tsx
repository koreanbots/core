import ReactSelect from 'react-select'

const Select: React.FC<SelectProps> = ({ placeholder, options, handleChange, handleTouch, value }) => {
	return <ReactSelect
		styles={{
			control: provided => {
				return { ...provided, border: 'none' }
			},
			option: provided => {
				return {
					...provided,
					cursor: 'pointer',
					':hover': {
						opacity: '0.7',
					},
				}
			},
			placeholder: provided => {
				return {
					...provided,
					position: 'absolute'
				}
			},
			singleValue: provided => {
				return {
					...provided,
					position: 'absolute'
				}
			}
		}}
		className='border-grey-light border dark:border-transparent rounded'
		classNamePrefix='outline-none text-black dark:bg-very-black dark:text-white '
		placeholder={placeholder || '선택해주세요.'}
		options={options}
		onChange={handleChange}
		onBlur={handleTouch}
		noOptionsMessage={() => '검색 결과가 없습니다.'}
		defaultValue={value}
	/>
}

interface SelectProps {
	placeholder?: string
	handleChange: (value: Option) => void
	handleTouch: () => void
	options: Option[]
	value?: Option
}

interface Option {
	value: string
	label: string
}

export default Select
