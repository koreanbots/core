import { Field } from 'formik'

const Input = ({ name, placeholder }:InputProps):JSX.Element => {
	return <Field name={name} className='text-black w-full h-10 border border-grey-light rounded px-3 relative focus:shadow outline-none' placeholder={placeholder}/>
}

interface InputProps {
  name: string
  placeholder?: string
}

export default Input

