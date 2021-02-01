import ReactSelect from 'react-select'

const Select = ({ placeholder, options, handleChange, handleTouch }:SelectProps):JSX.Element => {
	return <ReactSelect styles={{
		control: (provided) => {
			return { ...provided, border: 'none' }
		},
		option: (provided) => {
			return { ...provided, cursor: 'pointer', ':hover': {
				opacity: '0.7'
			} }
		}
	}} isMulti className='border border-grey-light dark:border-transparent rounded' classNamePrefix='outline-none text-black dark:bg-very-black dark:text-white cursor-pointer ' placeholder={placeholder || '선택해주세요.'} options={options} onChange={handleChange} onBlur={handleTouch} noOptionsMessage={() => '검색 결과가 없습니다.'}/>
}

interface SelectProps {
  placeholder?: string
  handleChange: (value: Option[]) => void
  handleTouch: () => void
  options: Option[]
}

interface Option {
  value: string
  label: string
}

export default Select