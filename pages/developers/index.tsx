import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Developers: NextPage = () => {
	const router = useRouter()
	useEffect(() => {
		router.push('/developers/applications')
	})
	return <></>
}

export default Developers
