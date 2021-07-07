import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { get, management } from '@utils/Query'
import { checkUserFlag, getUserFlags, parseCookie } from '@utils/Tools'
import { User, UserSpec } from '@types'

const Forbidden = dynamic(() => import('@components/Forbidden'))
const Container = dynamic(() => import('@components/Container'))

const ManagementPage: NextPage<ManagementProps> = ({ target, user }) => {
	if(checkUserFlag(user?.flags, 'staff')) return <Container paddingTop>
		<h1 className='text-3xl font-bold pt-2'>{target ? `${target.username}#${target.tag} (${target.id})` : 'Not Found'}</h1>
		<ul>
			<li>EMAIL: {target.email}</li>
			<li>FLAGS: {getUserFlags(target.flags).join(', ')}</li>
			<li>BLOCKED?: {target.perm !== 'user' ? 'true' : 'false'}</li>
			<li></li>
		</ul>
	</Container>
	return <Forbidden />
}

export const getServerSideProps: GetServerSideProps<ManagementProps> = async (ctx) => {
	const parsed = parseCookie(ctx.req)
	const userID = await get.Authorization(parsed?.token)
	const user = userID && await get.user.load(userID)
	if(!checkUserFlag(user?.flags, 'staff')) return { props: {} }
	return {
		props: {
			target: await management.user.get(ctx.params.id as string),
			user: user
		}
	}
}

interface ManagementProps {
  target?: UserSpec
  user?: User
}

export default ManagementPage