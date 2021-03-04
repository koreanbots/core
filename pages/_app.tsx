import Head from 'next/head'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'

import { init } from '@utils/Sentry'
import Logger from '@utils/Logger'
import { systemTheme } from '@utils/Tools'
import { shortcutKeyMap } from '@utils/Constants'
import { Theme } from '@types'

const Footer = dynamic(() => import('@components/Footer'))
const Navbar = dynamic(() => import('@components/Navbar'))
const Modal = dynamic(() => import('@components/Modal'))

import Crypto from 'crypto'

import 'core-js/es/promise'
import 'core-js/es/set'
import 'core-js/es/map'

import '../app.css'
import '../github-markdown.css'
import '@fortawesome/fontawesome-free/css/all.css'
import PlatformDisplay from '@components/PlatformDisplay'

init()

export default function App({ Component, pageProps, err }: KoreanbotsProps): JSX.Element {
	const [ betaKey, setBetaKey ] = useState('')
	const [ shortcutModal, setShortcutModal ] = useState(false)
	const [ theme, setTheme ] = useState<Theme>('system')
	const router = useRouter()

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
		<Navbar />
		<div className='iu-is-the-best h-full text-black dark:text-gray-100 dark:bg-discord-dark bg-white'>
			{
				process.env.NEXT_PUBLIC_TESTER_KEY === Crypto.createHmac('sha256', betaKey ?? '').digest('hex') ? 
					<Component {...pageProps} err={err} theme={theme} setTheme={setTheme} /> : 
					<div className='text-center py-40 px-10'>
						<h1 className='text-3xl font-bold'>주어진 테스터키를 입력해주세요.</h1><br/>
						<input value={betaKey} name='field_name' className='text-black border outline-none px-4 py-2 rounded-2xl' type='text' placeholder='테스터 키' onChange={(e)=> { localStorage.setItem('betaKey', e.target.value); setBetaKey(e.target.value) }} />
					</div>
			}
		</div>
		{
			!['/bots/[id]'].includes(router.pathname) && <Footer theme={theme} setTheme={setTheme} />
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
			SHORTCUT_HELP: () => {
				setShortcutModal(value => !value)
				return
			},
			CHANGE_THEME: () => {
				const overwrite = (localStorage.theme || systemTheme()) === 'dark' ? 'light' : 'dark'
				setTheme(overwrite)
				localStorage.setItem('theme', overwrite)
				return
			}
		}} />
	</div>
}

interface KoreanbotsProps extends AppProps {
	err: unknown
}