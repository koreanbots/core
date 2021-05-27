import { GetServerSideProps, NextPage } from 'next'

const Docs: NextPage = () => {
	return <></>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	ctx.res.statusCode = 301
	ctx.res.setHeader('Location', encodeURI('/developers/docs/시작하기'))
	return {
		props: {}
	}
}

export default Docs
