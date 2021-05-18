import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { redirectTo } from '@utils/Tools'

const Login: React.FC = ({ children }) => {
	const router = useRouter()
	useEffect(() => {
		localStorage.redirectTo = window.location.href
		redirectTo(router, 'login')
	})
	return <>
		{children}
	</>
}

export default Login