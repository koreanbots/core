import { Field } from 'formik'

const TextArea = ({ name, placeholder }:TextAreaProps):JSX.Element => {
	return <Field as='textarea' name={name} className='border border-grey-light dark:border-transparent text-black dark:bg-very-black dark:text-white w-full rounded px-4 py-3 relative min-h-3 resize-none outline-none' placeholder={placeholder} />
}

interface TextAreaProps {
  name: string
  placeholder?: string
}

export default TextArea

