import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Docs: NextPage = () => {
	const router = useRouter()
	useEffect(() => {
		router.push('/developers/docs/시작하기')
	})
	return <></>
}

export default Docs
