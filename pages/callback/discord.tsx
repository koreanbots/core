import { NextPage} from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { redirectTo } from '@utils/Tools'

const Loader = dynamic(() => import('@components/Loader'))

const DiscordCallback:NextPage = () => {
	const router = useRouter()
	useEffect(() => {
		redirectTo(router, localStorage.redirectTo ?? '/')
		localStorage.removeItem('redirectTo')
	}, [router])
  
	return <>
		<Loader text={<>리다이렉트 중 입니다.</>} />
	</>
}

export default DiscordCallback