// import { useState } from 'react'

const Search = ({ query, result }: SearchProps): JSX.Element => {
	return (
		<div>
			{query} { result }
			<input />
		</div>
	)
}

interface SearchProps {
	query: string
	result: string
}

export default Search
