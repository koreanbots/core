import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import Navbar from '../components/Navbar'

import 'core-js/es/promise'
import 'core-js/es/set'
import 'core-js/es/map'

import './app.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { useEffect } from 'react'
import Footer from '../components/Footer'

let systemColor
export default function App({ Component, pageProps }: AppProps): JSX.Element {
	useEffect(() => {
		console.log(
			'%c' + 'KOREANBOTS',
			'color: #3366FF; -webkit-text-stroke: 2px black; font-size: 72px; font-weight: bold;'
		)
		console.log(
			'%c' + '이곳에 코드를 붙여넣으면 공격자에게 엑세스 토큰을 넘겨줄 수 있습니다!!',
			'color: #ff0000; font-size: 20px; font-weight: bold;'
		)
		try {
			systemColor = window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
		} catch (e) {
			systemColor = 'dark'
		}
		if (!localStorage.theme || !['dark', 'light'].includes(localStorage.theme))
			localStorage.setItem('theme', systemColor)
	}, [])
	return (
		<ThemeProvider defaultTheme={systemColor} attribute="class" storageKey="theme">
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>한국 디스코드봇 리스트</title>
				<meta
					name="description"
					content="국내 디스코드봇들을 확인하고, 초대해보세요!"
					data-react-helmet="true"
				/>
				<meta charSet="utf-8" />
				<link rel="shortcut icon" href="/logo.png" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#3366FF" />
			</Head>
			<Navbar />
			<div className='iu h-screen'>
				<Component {...pageProps} />
			</div>
			<Footer />
		</ThemeProvider>
	)
}
