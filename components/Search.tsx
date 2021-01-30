// import { useState } from 'react'

const Search = (): JSX.Element => {
	return <div className='relative w-full mt-5 text-black bg-white dark:text-gray-100 dark:bg-very-black flex rounded-lg'>
		<input className='bg-transparent flex-grow outline-none border-none shadow border-0 py-3 px-7 pr-20 h-16 text-xl' placeholder='검색...' />
		<button className='outline-none cusor-pointer absolute right-0 top-0 mt-5 mr-5'>
			<i className='text-gray-600 hover:text-gray-700 text-2xl fas fa-search' />
		</button>
	</div>
}

interface SearchProps {
	query: string
	result: string
}

export default Search
