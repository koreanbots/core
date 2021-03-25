import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { verify } from '@utils/Jwt'
import { get } from '@utils/Query'
import { parseCookie, redirectTo } from '@utils/Tools'
import { User } from '@types'

const Loader = dynamic(() => import('@components/Loader'))

const DiscordCallback:NextPage<DiscordCallbackProps> = ({ data }) => {
	const router = useRouter()
	const [ redirect, setRedirect ] = useState(false)
	useEffect(() => {
		localStorage.userCache = JSON.stringify({
			id: data.id,
			username: data.username,
			tag: data.tag,
			version: 2
		})
		setRedirect(true)
	}, [ data ])
	function redirectWhere() {
		redirectTo(router, localStorage.redirectTo ?? '/')
		localStorage.removeItem('redirectTo')
		return
	}
	if(!data) {
		router.push('/api/auth/discord')
		return <div className='absolute right-1/2 bottom-1/2 text-center'>
			<h1 className='text-3xl text-bold'>리다이랙트중입니다.</h1>
		</div>
	}
  
	return <>
		<Loader text={<>로그인중입니다. 잠시만 기다려주세요.<br />이 페이지가 계속 표시된다면 새로고침해주세요.</>} />
		{
			redirect ? redirectWhere() : ''
		}
	</>
}

export const getServerSideProps = async(ctx: NextPageContext) => {
	const parsed = parseCookie(ctx.req)
	const token = verify(parsed?.token ?? '')
	if(!token) return { props: { data: null } }
  
	const userinfo = await get.user.load(token.id)
  
	return { props: { data: userinfo } }
}

interface DiscordCallbackProps {
  data: User | null
}

export default DiscordCallback