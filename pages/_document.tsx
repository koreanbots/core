import { DESCRIPTION, THEME_COLOR, TITLE } from '@utils/Constants'
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx)

		return initialProps
	}
	render() {
		return (
			<Html lang='ko-KR'>
				<Head>
					{/* META */}
					<meta charSet='utf-8' />
					<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
					<meta name='description' content={DESCRIPTION} />
					<meta name='keywords' content='Korea, Korean, Discord, Bot, 디스코드봇, 한디리' /> 
					<meta name='og:title' content={TITLE} />
					<meta name='og:url' content='https://koreanbots.dev' />
					<meta name='og:description' content={DESCRIPTION} />
					<meta name='og:image' content='/favicon.ico' />

					{/* Android */}
					<meta name='theme-color' content={THEME_COLOR} />
					<meta name='mobile-web-app-capable' content='yes' />
					
					{/* iOS */}
					<meta name='apple-mobile-web-app-title' content='Application Title' />
					<meta name='apple-mobile-web-app-capable' content='yes' />
					<meta name='apple-mobile-web-app-status-bar-style' content='default' />
					
					{/* Windows */}
					<meta name='msapplication-navbutton-color' content={THEME_COLOR} />
					<meta name='msapplication-TileColor' content={THEME_COLOR} />
					<meta name='msapplication-TileImage' content='/static/ms-icon-144x144.png' />
					<meta name='msapplication-config' content='browserconfig.xml' />

					{/* Pinned Sites */}
					<meta name='application-name' content={TITLE} />
					<meta name='msapplication-tooltip' content={DESCRIPTION} />
					<meta name='msapplication-starturl' content='/' />

					{/* Tap highlighting */}
					<meta name='msapplication-tap-highlight' content='no' />

					{/* UC Mobile Browser */}
					<meta name='full-screen' content='yes' />
					<meta name='browsermode' content='application' />

					<meta name='nightmode' content='disable' />
					<meta name='layoutmode' content='fitscreen' />
					<meta name='imagemode' content='force' />
					<meta name='screen-orientation' content='portrait' />
					
					{/* LINK */}
					<link rel='manifest' href='/manifest.json' />
					<link rel='search' type='application/opensearchdescription+xml' title={TITLE} href='/opensearch.xml' />
					<link
						rel='stylesheet'
						href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/solarized-dark.min.css'
					/>
					<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
					<link rel='icon' type='image/png' sizes='96x96' href='/favicon-96x96.png' />
					<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />

					{/* iOS */}
					<link rel='apple-touch-icon' sizes='57x57' href='/static/apple-icon-57x57.png' />
					<link rel='apple-touch-icon' sizes='60x60' href='/static/apple-icon-60x60.png' />
					<link rel='apple-touch-icon' sizes='72x72' href='/static/apple-icon-72x72.png' />
					<link rel='apple-touch-icon' sizes='76x76' href='/static/apple-icon-76x76.png' />
					<link rel='apple-touch-icon' sizes='114x114' href='/static/apple-icon-114x114.png' />
					<link rel='apple-touch-icon' sizes='120x120' href='/static/apple-icon-120x120.png' />
					<link rel='apple-touch-icon' sizes='144x144' href='/static/apple-icon-144x144.png' />
					<link rel='apple-touch-icon' sizes='152x152' href='/static/apple-icon-152x152.png' />
					<link rel='apple-touch-icon' sizes='180x180' href='/static/apple-icon-180x180.png' />
					<link rel='apple-touch-icon' sizes='256x256' href='/static/apple-icon-256x256.png' />
					<link rel='apple-touch-icon' sizes='512x512' href='/static/apple-icon-512x512.png' />


					{/* Android */}
					<link rel='icon' type='image/png' sizes='192x192'  href='/static/android-icon-192x192.png' />

					{/* Others */}
					<link rel='shortcut icon' href='/favicon.ico' />

					{/* SCRIPT */}
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
