import { Field } from 'formik'

const Input = ({ name, placeholder }:InputProps):JSX.Element => {
	return <Field name={name} className='border border-grey-light dark:border-transparent text-black dark:bg-very-black dark:text-white w-full h-10 rounded px-3 relative outline-none' placeholder={placeholder}/>
}

interface InputProps {
  name: string
  placeholder?: string
}

export default Input