import { NextPage} from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { redirectTo } from '@utils/Tools'

const Loader = dynamic(() => import('@components/Loader'))

const DiscordCallback:NextPage = () => {
	const router = useRouter()
	const [ notRedirecting, setNotRedirecting ] = useState(false)
	useEffect(() => {
		if(window.opener) {
			setNotRedirecting(true)
			window.opener.location.reload()
		} else {
			redirectTo(router, localStorage.redirectTo ?? '/')
			localStorage.removeItem('redirectTo')
		}
	}, [router])
  
	return <>
		<Loader text={notRedirecting ? '해당 창을 닫고 원래 앱으로 돌아가주세요.' : '리다이렉트 중 입니다.'} />
	</>
}

export default DiscordCallback