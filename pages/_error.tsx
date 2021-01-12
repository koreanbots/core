import { NextPage, NextPageContext } from 'next'
import Notice from '../components/Notice'
import { ErrorText } from '../utils/Constants'

const CustomError:NextPage<ErrorProps> = ({ statusCode, statusText }) => {
	return <Notice header={String(statusCode)} desc={statusText} />
}

export const getServerSideProps = ({ res, err }:NextPageContext) => {
	let statusCode:number
	// If the res variable is defined it means nextjs
	// is in server side
	if (res) {
		statusCode = res.statusCode
	} else if (err) {
		// if there is any error in the app it should
		// return the status code from here
		statusCode = err.statusCode
	} else {
		// Something really bad/weird happen and status code
		// cannot be determined.
		statusCode = null
	}
	const statusText:string = ErrorText[statusCode] ?? ErrorText.DEFAULT
	return { props: { statusCode, statusText } }
}

export default CustomError


interface ErrorProps {
  statusCode: number
  statusText: string
}