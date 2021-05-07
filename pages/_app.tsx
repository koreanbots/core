import Head from 'next/head'
import App, { AppContext, AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { Router, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import NProgress from 'nprogress'

import Logger from '@utils/Logger'
import { parseCookie, systemTheme } from '@utils/Tools'
import { shortcutKeyMap } from '@utils/Constants'
import { Theme } from '@types'

const Footer = dynamic(() => import('@components/Footer'))
const Navbar = dynamic(() => import('@components/Navbar'))
const Modal = dynamic(() => import('@components/Modal'))

import 'core-js/es/promise'
import 'core-js/es/set'
import 'core-js/es/map'

import '../app.css'
import '../github-markdown.css'
import 'rc-tooltip/assets/bootstrap_white.css'
import '@fortawesome/fontawesome-free/css/all.css'
import PlatformDisplay from '@components/PlatformDisplay'

// Progress Bar
NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', NProgress.start)
Router.events.on('routeChangeComplete', NProgress.done)
Router.events.on('routeChangeError', NProgress.done)

const KoreanbotsApp = ({ Component, pageProps, err, cookie }: KoreanbotsProps): JSX.Element => {
	const [ shortcutModal, setShortcutModal ] = useState(false)
	const [ theme, setTheme ] = useState<Theme>('system')
	const router = useRouter()

	useEffect(() => {
		console.log(
			'%c' + 'KOREANBOTS',
			'color: #3366FF; -webkit-text-stroke: 2px black; font-size: 72px; font-weight: bold;'
		)
		console.log(
			'%c' + '이곳에 코드를 붙여넣으면 공격자에게 엑세스 토큰을 넘겨줄 수 있습니다!!',
			'color: #ff0000; font-size: 20px; font-weight: bold;'
		)
		if (!localStorage.theme) {
			Logger.debug(`[THEME] ${systemTheme().toUpperCase()} THEME DETECTED`)
			setTheme(systemTheme())
		}
		else setTheme(localStorage.theme)
	}, [])

	return <div className={theme}>
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
		<Navbar token={cookie.token} />
		<div className='iu-is-the-best min-h-screen text-black dark:text-gray-100 dark:bg-discord-dark bg-white'>
			<Component {...pageProps} err={err} theme={theme} setTheme={setTheme} />
		</div>
		{
			!(router.pathname.startsWith('/developers')) && <Footer theme={theme} setTheme={setTheme} />
		}
		<Modal full isOpen={shortcutModal} onClose={() => setShortcutModal(false)} dark={theme === 'dark'} header='단축키 안내'>
			<div className='px-3 h-80'>
				<h3 className='text-md font-semibold'>일반</h3>
				<ul>
					<li className='pt-2'>
						<h4 className='text-gray-500 dark:text-gray-400 text-xs'>단축키 도움말 표시</h4>
						<kbd>
							<PlatformDisplay osx='CMD'>
								Ctrl
							</PlatformDisplay> 
						</kbd> <kbd>/</kbd>
					</li>
					<li className='pt-2'>
						<h4 className='text-gray-500 dark:text-gray-400 text-xs'>다크모드 전환</h4>
						<kbd>
							<PlatformDisplay osx='CMD'>
								Ctrl
							</PlatformDisplay> 
						</kbd>
						<kbd>Shift</kbd> <kbd>D</kbd>
					</li>
				</ul>
			</div>
		</Modal>
		<GlobalHotKeys keyMap={shortcutKeyMap} handlers={{
			SHORTCUT_HELP: (event) => {
				event.preventDefault()
				setShortcutModal(value => !value)
				return
			},
			CHANGE_THEME: (event) => {
				event.preventDefault()
				const overwrite = (localStorage.theme || systemTheme()) === 'dark' ? 'light' : 'dark'
				setTheme(overwrite)
				localStorage.setItem('theme', overwrite)
				return false
			}
		}} />
	</div>
}

KoreanbotsApp.getInitialProps = async (appCtx: AppContext) => {
	const appProps = await App.getInitialProps(appCtx)
	const parsed = parseCookie(appCtx.ctx.req)
	return {
		...appProps,
		cookie: parsed
	}
}

export default KoreanbotsApp

interface KoreanbotsProps extends AppProps {
	err: unknown
	cookie: {
		token?: string
	}
}