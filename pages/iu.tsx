import { GetServerSideProps } from 'next'
import NotFound from './404'

export const getServerSideProps: GetServerSideProps = async ctx => {
	ctx.res.statusCode = 516
	ctx.res.setHeader('IU', '<3')
	return {
		props: {}
	}
}

export default NotFound