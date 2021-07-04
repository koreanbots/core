import { TITLE } from '@utils/Constants'
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
					<link rel='apple-touch-startup-image' href='/static/iphone5_splash.png' media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)' />
					<link rel='apple-touch-startup-image' href='/static/iphone6_splash.png' media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' />
					<link rel='apple-touch-startup-image' href='/static/iphoneplus_splash.png' media='(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)' />
					<link rel='apple-touch-startup-image' href='/static/iphonex_splash.png' media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)' />
					<link rel='apple-touch-startup-image' href='/static/iphonexr_splash.png' media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)' />
					<link rel='apple-touch-startup-image' href='/static/iphonexsmax_splash.png' media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)' />
					<link rel='apple-touch-startup-image' href='/static/ipad_splash.png' media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)' />
					<link rel='apple-touch-startup-image' href='/static/ipadpro1_splash.png' media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)' />
					<link rel='apple-touch-startup-image' href='/static/ipadpro3_splash.png' media='(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)' />
					<link rel='apple-touch-startup-image' href='/static/ipadpro2_splash.png' media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)' />

					{/* Android */}
					<link rel='icon' type='image/png' sizes='192x192'  href='/static/android-icon-192x192.png' />

					{/* Others */}
					<link rel='shortcut icon' href='/favicon.ico' />

					{/* SCRIPT */}
					<script src='//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/highlight.min.js'></script>
					<script data-ad-client='ca-pub-4856582423981759' async src='//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'></script>
					<script data-cfasync='false' async src='//www.googletagmanager.com/gtag/js?id=UA-165454387-1'></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){window.dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'UA-165454387-1', { 'optimize_id': 'OPT-NXSXXB5' });
						
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
