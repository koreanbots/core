import { Field } from 'formik'

const Input: React.FC<InputProps> = ({ name, placeholder, ...props }) => {
	return <Field
		{...props}
		name={name}
		className={'border-grey-light relative px-3 w-full h-10 text-black dark:text-white dark:bg-very-black border dark:border-transparent rounded outline-none'}
		placeholder={placeholder}
	/>
}

interface InputProps {
	name: string
	placeholder?: string
	warning?: boolean
	[key: string]: unknown
}

export default Input
