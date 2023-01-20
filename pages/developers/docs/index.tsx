import { GetServerSideProps, NextPage } from 'next'

const Docs: NextPage = () => {
	return <></>
}

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: '/developers/docs/시작하기',
			permanent: true
		},
		props: {}
	}
}

export default Docs
