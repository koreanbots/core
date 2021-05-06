import { redirectTo } from '@utils/Tools'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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