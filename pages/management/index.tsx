import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { get } from '@utils/Query'
import { checkUserFlag, parseCookie } from '@utils/Tools'
import { User } from '@types'

const Forbidden = dynamic(() => import('@components/Forbidden'))
const Container = dynamic(() => import('@components/Container'))
const Redirect = dynamic(() => import('@components/Redirect'))

const ManagementPage: NextPage<ManagementProps> = ({ user }) => {
	if(checkUserFlag(user.flags, 'staff')) return <Container paddingTop>
		<h1 className='text-3xl font-bold'>관리 페이지</h1>
	</Container>
	else if(checkUserFlag(user.flags, 'botreviewer')) return <Redirect to='/management/botreview' />
	return <Forbidden />
}

export const getServerSideProps: GetServerSideProps<ManagementProps> = async (ctx) => {
	const parsed = parseCookie(ctx.req)
	const userID = await get.Authorization(parsed?.token)
	return {
		props: {
			user: userID && await get.user.load(userID)
		}
	}
}

interface ManagementProps {
  user: User
}

export default ManagementPage