import { Field } from 'formik'

const CheckBox = ({ name, ...props }:CheckBoxProps):JSX.Element => {
	return <Field type='checkbox' name={name} className='mr-1 h-4 w-4 rounded' {...props}/>
}

interface CheckBoxProps {
  name: string
  [key: string]: unknown
}

export default CheckBox