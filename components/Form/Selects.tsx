import Tag from '@components/Tag'
import { FieldArray, useFormik } from 'formik'

const Selects = ({ name, value, options }:SelectsProps):JSX.Element => {
	const formik = useFormik({
		initialValues: {
			search: ''
		},
		onSubmit: () => { console.log('Submit') }
	})
	return <div className='w-full'>
		<input name='search' className='text-black w-full h-10 border border-grey-light rounded px-3 focus:shadow outline-none' value={formik.values.search} onChange={formik.handleChange}/>
		<FieldArray name={name} >
			{
				({ insert, remove, push }) => (
					<>
						<div className='rounded shadow-md my-2 pin-t pin-l dark:bg-very-black h-60 overflow-y-scroll w-full'>
							<ul>
								{
									options.filter(el => el.includes(formik.values.search) && !value.includes(el)).length !== 0 ? options.filter(el => el.includes(formik.values.search) && !value.includes(el)).map(el=> (
										<li key={el} className='cursor-pointer px-3 py-3.5 hover:bg-discord-dark-hover' onClick={()=> push(el)} onKeyPress={()=> push(el)} >{el}</li>
									)) : <li className='px-3 py-3.5'>검색 결과가 없습니다.</li>
								}
							</ul>
						</div>
						<div className='flex flex-wrap'>
							{
								value.map(el => (
									<Tag key={el} text={<>{el} <i className='fas fa-times' /></>} className='cursor-pointer' onClick={() => remove(value.indexOf(el))} />
								))
							}
						</div>
					</>
				)
			}
		</FieldArray>
	</div>

}

interface SelectsProps {
  name: string
  value: string[]
  options: string[]
}

export default Selects