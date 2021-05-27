import { GetServerSideProps, NextPage } from 'next'

const Developers: NextPage = () => {
	return <></>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	ctx.res.statusCode = 301
	ctx.res.setHeader('Location', '/developers/applications')
	return {
		props: {}
	}
}

export default Developers
