import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Reserved: NextPage = () => {
	const router = useRouter()
	router.push('/bots/iu')
	return <></>
}

export default Reserved
