import DatePicker, { registerLocale } from 'react-datepicker'
import { ko } from 'date-fns/locale'

import 'react-datepicker/dist/react-datepicker.css'

registerLocale('ko', ko)

const DateSelect: React.FC<DateSelectProps> = ({ ...props }) => {
	return <DatePicker
		locale='ko'
		className='border-grey-light relative px-3 w-full py-1.5 text-black dark:text-white dark:bg-very-black border dark:border-transparent rounded outline-none'
		dateFormat='yyyy.MM.dd'
		{...props}
	/>
}


interface DateSelectProps {
    [key: string]: unknown
}


export default DateSelect
