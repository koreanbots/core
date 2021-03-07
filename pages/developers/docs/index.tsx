import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Docs: NextPage = () => {
	const router = useRouter()
	router.push('/developers/docs/시작하기')
	return <></>
}

export default Docs
