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
					<link
						rel='stylesheet'
						href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/solarized-dark.min.css'
					/>
					<link rel='search' type='application/opensearchdescription+xml' title='한국 디스코드봇 리스트' href='/opensearch.xml' />
					<script src='//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/highlight.min.js'></script>
					<script
						data-ad-client='ca-pub-4856582423981759'
						async
						src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
					></script>
					<script async src='https://www.googletagmanager.com/gtag/js?id=UA-165454387-1'></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){window.dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'UA-165454387-1');
						
						if(/MSIE \\d|Trident.*rv:/.test(navigator.userAgent)) {
							window.location = 'microsoft-edge:' + window.location;
							setTimeout(function() {
								window.location = 'https://go.microsoft.com/fwlink/?linkid=2135547';
							}, 1);
						}
						`,
						}}
					/>
				</Head>
				<body className='h-full text-black dark:text-gray-100 dark:bg-discord-dark bg-white overflow-x-hidden'>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
