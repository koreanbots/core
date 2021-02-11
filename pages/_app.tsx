import Head from 'next/head'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { init } from '@utils/Sentry'

const Footer = dynamic(() => import('@components/Footer'))
const Navbar = dynamic(() => import('@components/Navbar'))

import Crypto from 'crypto'

import 'core-js/es/promise'
import 'core-js/es/set'
import 'core-js/es/map'

import '../app.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '../github-markdown.css'
import { Theme } from '@types'

init()

export default function App({ Component, pageProps, err }: KoreanbotsProps): JSX.Element {
	const [ betaKey, setBetaKey ] = useState('')
	const [ footer, footerControl ] = useState(true)
	const [ theme, setTheme ] = useState<Theme>('system')
	let systemColor:Theme

	useEffect(() => {
		setBetaKey(localStorage.betaKey)
		console.log(
			'%c' + 'KOREANBOTS',
			'color: #3366FF; -webkit-text-stroke: 2px black; font-size: 72px; font-weight: bold;'
		)
		console.log(
			'%c' + '이곳에 코드를 붙여넣으면 공격자에게 엑세스 토큰을 넘겨줄 수 있습니다!!',
			'color: #ff0000; font-size: 20px; font-weight: bold;'
		)
		try {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			systemColor = window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
		} catch (e) {
			systemColor = 'dark'
		}
		if (!localStorage.theme) {
			console.log(`[THEME] ${systemColor.toUpperCase()} THEME DETECTED`)
			setTheme(systemColor)
		}
		else setTheme('system')
	}, [])

	return (
		<div className={theme}>
			<Head>
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>한국 디스코드봇 리스트</title>
				<meta name='description' content='다양한 국내 디스코드봇들을 확인하고, 초대해보세요!' />
				<meta name='og:title' content='한국 디스코드봇 리스트' />
				<meta name='og:url' content='https://koreanbots.dev' />
				<meta name='og:description' content='다양한 국내 디스코드봇들을 확인하고, 초대해보세요!' />
				<meta name='og:image' content='/logo.png' />
				<meta charSet='utf-8' />
				<link rel='shortcut icon' href='/logo.png' />
				<meta name='theme-color' content='#3366FF' />
			</Head>
			<Navbar theme={theme} setTheme={setTheme} />
			<div className='iu-is-the-best h-full text-black dark:text-gray-100 dark:bg-discord-dark bg-white'>
				{
					process.env.NEXT_PUBLIC_TESTER_KEY === Crypto.createHmac('sha256', betaKey ?? '').digest('hex') ? <Component {...pageProps} err={err} footerControl={footerControl} theme={theme} setTheme={setTheme} /> : <div className='text-center py-40 px-10'>
						<h1 className='text-3xl font-bold'>주어진 테스터키를 입력해주세요.</h1><br/>
						<input value={betaKey} name='field_name' className='text-black border outline-none px-4 py-2 rounded-2xl' type='text' placeholder='테스터 키' onChange={(e)=> { localStorage.setItem('betaKey', e.target.value); setBetaKey(e.target.value) }} />
					</div>
				}
			</div>
			{
				footer && <Footer theme={theme} setTheme={setTheme} />
			}
		</div>
	)
}

interface KoreanbotsProps extends AppProps {
	err: unknown
}