import { NextPage, NextPageContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Container from '../../components/Container'
import Fetch from '../../utils/Fetch'

const Bots:NextPage = () => {
	return <Container>
		<h1>GG</h1>
	</Container>
}

export const getServerSideProps = async (ctx: Context) => {
	console.log(ctx.query)
	return { props: { data: {} } }
}

export default Bots

interface Context extends NextPageContext {
  query: Query
}

interface Query extends ParsedUrlQuery {
  id: string
}