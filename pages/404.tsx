import { NextPage } from 'next'
import Container from '../components/Container'
import Notice from '../components/Notice'
import { ErrorText } from '../utils/Constants'

const NotFound: NextPage = () => {
	return <Notice header='404' desc={ErrorText[404]} />
}

export default NotFound
