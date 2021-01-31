import { Field } from 'formik'

const TextArea = ({ name, placeholder }:TextAreaProps):JSX.Element => {
	return <Field as='textarea' name={name} className='text-black w-full border border-grey-light rounded px-4 py-3 relative focus:border-blue focus:shadow min-h-2 max-h-3' placeholder={placeholder} />
}

interface TextAreaProps {
  name: string
  placeholder?: string
}

export default TextArea

