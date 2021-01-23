// import { useState } from 'react'

const Search = (): JSX.Element => {
	return (
		<div className='relative w-full mt-5 flex'>
			<input type='search' className='outline-none shadow rounded-lg border-0 p-3 w-full h-16 text-xl dark:bg-very-black pr-20' placeholder='검색...' />
		</div>
	)
}

interface SearchProps {
	query: string
	result: string
}

export default Search
