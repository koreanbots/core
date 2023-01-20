import { GetServerSideProps, NextPage } from 'next'

const Developers: NextPage = () => {
	return <></>
}

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: '/developers/applications',
			permanent: true
		},
		props: {}
	}
}

export default Developers
