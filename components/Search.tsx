import { useState } from 'react'
import Link from 'next/link'


import { makeBotURL } from '@utils/Tools'
import Fetch from '@utils/Fetch'
import { BotList, ResponseProps } from '@types'

import DiscordAvatar from './DiscordAvatar'

const Search = (): JSX.Element => {
	const [ query, setQuery ] = useState('')
	const [ data, setData ] = useState<ResponseProps<BotList>>(null)
	const [ loading, setLoading ] = useState(false)
	const [ abortControl, setAbortControl ] = useState(new AbortController())
	const [ hidden, setHidden ] = useState(true)
	const SearchResults = async (value: string) => {
		setQuery(value)
		try { abortControl.abort() } catch { return null }
		const controller = new AbortController()
		setAbortControl(controller)
		if(value.length > 2) setLoading(true)
		const res = await Fetch<BotList>(`/search/bots?q=${encodeURIComponent(value)}`, { signal: controller.signal })
		setData(res)
		setLoading(false)

	}
	return <>
		<div onFocus={() => setHidden(false)} onBlur={() => setTimeout(() => setHidden(true), 80)} className='relative w-full mt-5 text-black bg-white dark:text-gray-100 dark:bg-very-black flex rounded-lg z-30'>
			<input maxLength={50}  className='bg-transparent flex-grow outline-none border-none shadow border-0 py-3 px-7 pr-20 h-16 text-xl' placeholder='검색...' value={query} onChange={(e)=> {
				SearchResults(e.target.value)
			}} />
			<button className='outline-none cusor-pointer absolute right-0 top-0 mt-5 mr-5'>
				<i className='text-gray-600 hover:text-gray-700 text-2xl fas fa-search' />
			</button>
		</div>
		<div className={`relative ${hidden ? 'hidden' : 'block'}`}>
			<div className='absolute rounded shadow-md my-2 pin-t pin-l text-black bg-white dark:bg-very-black h-60 md:h-80 overflow-y-scroll w-full'>
				<ul>
					{
						data && data.code === 200 && data.data ? data.data.data.length === 0 ? <li className='px-3 py-3.5'>검색 결과가 없습니다.</li> : 
							data.data.data.map(el => <Link key={el.id} href={makeBotURL(el)}>
								<li className='px-3 py-2 flex h-15 cursor-pointer'>
									<DiscordAvatar className='w-12 h-12 mt-1' size={128} userID={el.id} /> 
									<div className='ml-2'>
										<h1 className='text-lg'>{el.name}</h1>
										<p className='text-sm text-gray-400'>
											{el.intro}
										</p>
									</div>
								</li>
							</Link>) : loading ? <li className='px-3 py-3.5'>검색중입니다...</li> : <li className='px-3 py-3.5'>{query && data ? data.errors && data.errors[0] || data.message?.includes('문법') ? <>검색 문법이 잘못되었습니다.<br/><a className='text-blue-500 hover:text-blue-400' href='https://docs.koreanbots.dev/bots/usage/search' target='_blank' rel='noreferrer' >더 알아보기</a></> : data.message : query.length < 3 ? '최소 2글자 이상 입력해주세요.' : '검색어를 입력해주세요.'}</li>
					}
					
				</ul>
			</div>
		</div>
	</>
}

export default Search
