import { Field } from 'formik'

const TextArea = ({ name, placeholder }:TextAreaProps):JSX.Element => {
	return <Field as='textarea' name={name} className='text-black dark:bg-very-black dark:text-white w-full rounded px-4 py-3 relative min-h-2 max-h-3 outline-none' placeholder={placeholder} />
}

interface TextAreaProps {
  name: string
  placeholder?: string
}

export default TextArea

