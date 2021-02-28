import { Field } from 'formik'

const Input = ({ name, placeholder }: InputProps): JSX.Element => {
	return (
		<Field
			name={name}
			className='border-grey-light relative px-3 w-full h-10 text-black dark:text-white dark:bg-very-black border dark:border-transparent rounded outline-none'
			placeholder={placeholder}
		/>
	)
}

interface InputProps {
	name: string
	placeholder?: string
}

export default Input
