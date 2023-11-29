import { Field } from 'formik'

const Input: React.FC<InputProps> = ({ name, placeholder, ...props }) => {
	return (
		<Field
			{...props}
			name={name}
			className={
				'border-grey-light relative h-10 w-full rounded border px-3 text-black outline-none dark:border-transparent dark:bg-very-black dark:text-white'
			}
			placeholder={placeholder}
		/>
	)
}

interface InputProps {
	name: string
	placeholder?: string
	warning?: boolean
	[key: string]: unknown
}

export default Input
