import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Developers: NextPage = () => {
	const router = useRouter()
	router.push('/developers/applications')
	return <></>
}

export default Developers