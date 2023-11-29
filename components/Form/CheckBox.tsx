import { Field } from 'formik'

const CheckBox: React.FC<CheckBoxProps> = ({ name, ...props }) => {
	return (
		<Field
			type='checkbox'
			name={name}
			className='form-checkbox h-4 w-4 rounded bg-gray-300 text-koreanbots-blue'
			{...props}
		/>
	)
}

interface CheckBoxProps {
	name: string
	[key: string]: unknown
}

export default CheckBox
