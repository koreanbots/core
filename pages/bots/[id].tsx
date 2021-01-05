import { GetServerSideProps, NextPage } from 'next'
import Container from '../../components/Container'

const Bots:NextPage = () => {
	return <Container>
		<h1>GG</h1>
	</Container>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	return { props: { data: {} } }
}
export default Bots