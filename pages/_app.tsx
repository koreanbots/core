
import Head from 'next/head'
import type { AppProps /*, AppContext */ } from 'next/app'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Next.js TypeScript Quickstart</title>
			</Head>
			<Component {...pageProps} />
		</>
	)
}
export default App