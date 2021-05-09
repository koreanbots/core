import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AbortController from 'abort-controller'

import { makeBotURL, redirectTo } from '@utils/Tools'
import Fetch from '@utils/Fetch'
import { BotList, ResponseProps } from '@types'

import DiscordAvatar from '@components/DiscordAvatar'
import Day from '@utils/Day'
import useOutsideClick from '@utils/useOutsideClick'

const Search = (): JSX.Element => {
	const router = useRouter()
	const ref = useRef()
	const [query, setQuery] = useState('')
	const [recentSearch, setRecentSearch] = useState([])
	const [data, setData] = useState<ResponseProps<BotList>>(null)
	const [loading, setLoading] = useState(false)
	const [abortControl, setAbortControl] = useState(new AbortController())
	const [hidden, setHidden] = useState(true)
	useEffect(() => {
		setQuery('')
		setData(null)
		setLoading(false)
		try {
			setRecentSearch(JSON.parse(localStorage.recentSearch))
		} catch {
			setRecentSearch([])
		}
	}, [router])
	useOutsideClick(ref, () => setHidden(true))
	const SearchResults = async (value: string) => {
		setQuery(value)
		try {
			abortControl.abort()
		} catch (e) {
			return null
		}
		const controller = new AbortController()
		setAbortControl(controller)
		if (value.length > 1) setLoading(true)
		const res = await Fetch<BotList>(`/search/bots?q=${encodeURIComponent(value)}`, {
			signal: controller.signal,
		}).catch((e) => {
			if(e.name !== 'AbortError') throw e
			else return
		})
		setData(res || {})
		setLoading(false)
	}

	const onSubmit = () => {
		if(query.length < 2) return
		if(!localStorage.recentSearch) localStorage.recentSearch = '[]'
		try {
			const d = JSON.parse(localStorage.recentSearch).reverse()
			if(d.findIndex(n => n.value === query) !== -1) d.splice(d.findIndex(n => n.value === query), 1)
			d.push({
				value: query,
				date: new Date().getTime()
			})
			d.reverse()
			setRecentSearch(d.slice(0, 10))
			localStorage.recentSearch = JSON.stringify(d.slice(0, 10))
		} catch {
			setRecentSearch([{
				value: query,
				date: new Date().getTime()
			}])
			localStorage.recentSearch = JSON.stringify(recentSearch)
		} finally {
			redirectTo(router, `/search/?q=${encodeURIComponent(query)}`)
		}
	}

	return (
		<div onFocus={() => setHidden(false)} ref={ref}>
			<div
				className='relative z-10 flex mt-5 w-full text-black dark:text-gray-100 dark:bg-very-black bg-white rounded-lg'
			>
				<input
					maxLength={50}
					className='flex-grow pr-20 px-7 py-3 h-16 text-xl bg-transparent border-0 border-none outline-none shadow'
					placeholder='검색...'
					value={query}
					onChange={e => {
						SearchResults(e.target.value)
					}}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							onSubmit()
						}
					}}
				/>
				<button
					className='cusor-pointer absolute right-0 top-0 mr-5 mt-5 outline-none'
					onClick={onSubmit}
				>
					<i className='fas fa-search text-gray-600 hover:text-gray-700 text-2xl' />
				</button>
			</div>
			<div className={`relative ${hidden ? 'hidden' : 'block'} z-50`}>
				<div className='pin-t pin-l absolute my-2 w-full h-60 text-black dark:text-gray-100 dark:bg-very-black bg-white rounded shadow-md overflow-y-scroll md:h-80'>
					<ul>
						{data && data.code === 200 && data.data ? (
							data.data.data.length === 0 ? (
								<li className='px-3 py-3.5'>검색 결과가 없습니다.</li>
							) : (
								data.data.data.map(el => (
									<Link key={el.id} href={makeBotURL(el)}>
										<li className='h-15 flex px-3 py-2 cursor-pointer'>
											<DiscordAvatar className='mt-1 w-12 h-12' size={128} userID={el.id} />
											<div className='ml-2'>
												<h1 className='text-black dark:text-gray-100 text-lg'>{el.name}</h1>
												<p className='text-gray-400 text-sm'>{el.intro}</p>
											</div>
										</li>
									</Link>
								))
							)
						) : loading ? (
							<li className='px-3 py-3.5'>검색중입니다...</li>
						) : (
							<>
								{query && data ? (
									data.message?.includes('문법') ? (
										<li className='px-3 py-3.5'>
											검색 문법이 잘못되었습니다.
											<br />
											<a
												className='hover:text-blue-400 text-blue-500'
												href='https://docs.koreanbots.dev/bots/usage/search'
												target='_blank'
												rel='noreferrer'
											>
												더 알아보기
											</a>
										</li>
									) : <li className='px-3 py-3.5'>{(data.errors && data.errors[0]) || data.message}</li>
								) : query.length === 0 ?	!recentSearch || !Array.isArray(recentSearch) || recentSearch.length === 0? <li className='px-3 py-3.5'>최근 검색 기록이 없습니다.</li>
									: <>
										<li className='h-15 px-3 py-2 cursor-pointer font-semibold'>
											최근 검색어
											<button className='absolute right-0 pr-10 text-sm text-red-500 hover:opacity-90' onClick={() => {
												setRecentSearch([])
												localStorage.recentSearch = '[]'
											}}>
												전체 삭제
											</button>
										</li>
										{
											recentSearch.slice(0, 10).map((el, n) => (
												<Link key={n} href={`/search?q=${encodeURIComponent(el?.value)}`}>
													<li className='h-15 px-3 py-2 cursor-pointer'>
														<i className='fas fa-history' /> {el?.value}
														<span className='absolute right-0 pr-10 text-gray-400 text-sm'>
															{Day(el?.date).format('MM.DD.')}
														</span>
													</li>
												</Link>
											))
										}
									</> :
									query.length < 3 ? (
										'최소 2글자 이상 입력해주세요.'
									) : (
										'검색어를 입력해주세요.'
									)}
							</>
						)}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Search
