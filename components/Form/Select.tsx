import { Field } from 'formik'

const Select = ({ name, options }:SelectProps):JSX.Element => {
	return <Field as='select' name={name} className='text-black w-full h-10 border border-grey-light rounded px-3 relative focus:shadow outline-none'>
		{
			options.map(o => (
				<option key={o}>{o}</option>
			))
		}
	</Field>
}

interface SelectProps {
  name: string
  options: string[]
}

export default Select