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
					<meta charSet='utf-8' />
					<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
					<meta name='description' content='다양한 국내 디스코드봇들을 확인하고, 초대해보세요!' />
					<meta name='og:title' content='한국 디스코드봇 리스트' />
					<meta name='og:url' content='https://koreanbots.dev' />
					<meta name='og:description' content='다양한 국내 디스코드봇들을 확인하고, 초대해보세요!' />
					<meta name='og:image' content='/favicon.ico' />
					<link rel='shortcut icon' href='/favicon.ico' />
					<link
						rel='stylesheet'
						href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/solarized-dark.min.css'
					/>
					<link rel='search' type='application/opensearchdescription+xml' title='한국 디스코드봇 리스트' href='/opensearch.xml' />
					<link rel='apple-touch-icon' sizes='57x57' href='/apple-icon-57x57.png' />
					<link rel='apple-touch-icon' sizes='60x60' href='/apple-icon-60x60.png' />
					<link rel='apple-touch-icon' sizes='72x72' href='/apple-icon-72x72.png' />
					<link rel='apple-touch-icon' sizes='76x76' href='/apple-icon-76x76.png' />
					<link rel='apple-touch-icon' sizes='114x114' href='/apple-icon-114x114.png' />
					<link rel='apple-touch-icon' sizes='120x120' href='/apple-icon-120x120.png' />
					<link rel='apple-touch-icon' sizes='144x144' href='/apple-icon-144x144.png' />
					<link rel='apple-touch-icon' sizes='152x152' href='/apple-icon-152x152.png' />
					<link rel='apple-touch-icon' sizes='180x180' href='/apple-icon-180x180.png' />
					<link rel='icon' type='image/png' sizes='192x192'  href='/android-icon-192x192.png' />
					<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
					<link rel='icon' type='image/png' sizes='96x96' href='/favicon-96x96.png' />
					<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
					<link rel='manifest' href='/manifest.json' />
					<meta name='msapplication-TileColor' content='#3366FF' />
					<meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
					<meta name='theme-color' content='#3366FF' />
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
