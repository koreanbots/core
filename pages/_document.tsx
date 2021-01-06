import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx)

		return initialProps
	}
	render() {
		return (
			<Html>
				<Head>
					<script
						data-ad-client="ca-pub-4856582423981759"
						async
						src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
					></script>
					<script async src="https://www.googletagmanager.com/gtag/js?id=UA-165454387-1"></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `
						(adsbygoogle = window.adsbygoogle || []).push({});
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'UA-165454387-1');`,
						}}
					/>
				</Head>
				<body className="h-full text-black dark:text-gray-100 bg-white dark:bg-discord-dark">
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
