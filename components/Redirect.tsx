import { ReactNode, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { redirectTo } from '@utils/Tools'

const Container = dynamic(() => import('@components/Container'))

const Redirect = ({ to, text=true, children }:RedirectProps):JSX.Element => {
	const router = useRouter()
	if(!to) throw new Error('No Link')
	useEffect(() => {
		redirectTo(router, to)
	}, [])
	if(children) return <>
		{children}
	</>
	return <Container paddingTop>
		<div>
			<a href={to} className='text-blue-400'>{text && '자동으로 리다이렉트되지 않는다면 클릭하세요.'}</a>
		</div>
	</Container>
}

interface RedirectProps {
  to: string
	text?: boolean
	children?: ReactNode
}

export default Redirect