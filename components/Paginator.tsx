import Link from 'next/link'
const Paginator = ({ currentPage, totalPage, pathname, searchParams }: PaginatorProps): JSX.Element => {
	let pages = []
	if (currentPage < 4)
		pages = [
			1,
			totalPage < 2 ? null : 2,
			totalPage < 3 ? null : 3,
			totalPage < 4 ? null : 4,
			totalPage < 5 ? null : 5,
		]
	else if (currentPage > totalPage - 3)
		pages = [
			totalPage - 4 < 1 ? null : totalPage - 4,
			totalPage - 3 < 1 ? null : totalPage - 3,
			totalPage - 2 < 1 ? null : totalPage - 2,
			totalPage - 1 < 1 ? null : totalPage - 1,
			totalPage,
		]
	else
		pages = [
			currentPage - 2 < 1 ? null : currentPage - 2,
			currentPage - 1 < 1 ? null : currentPage - 1,
			currentPage,
			currentPage + 1 > totalPage ? null : currentPage + 1,
			currentPage + 2 > totalPage ? null : currentPage + 2,
		]
	pages = pages.filter(el => el)
	return (
		<div className='flex flex-col items-center justify-center py-4 text-center'>
			<div className='flex'>
				<Link href={{ pathname, hash: 'list', query: { ...searchParams, page: currentPage - 1 } }}>
					<a
						className={`${
							currentPage === 1 ? 'invisible' : ''
						} h-12 w-12 mr-1 flex justify-center items-center rounded-full transition duration-150 ease-in bg-gray-200 dark:bg-discord-black hover:bg-gray-300 dark:hover:bg-discord-dark-hover cursor-pointer text-center`}
					>
						<i className='fas fa-chevron-left'></i>
					</a>
				</Link>
				{pages.map((el, i) => (
					<Link key={i} href={{ pathname, hash: 'list', query: { ...searchParams, page: el } }}>
						<a
							className={`w-12 flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in ${
								i === 0 && i === pages.length - 1
									? 'rounded-full'
									: i === 0
										? 'rounded-l-full'
										: i === pages.length - 1
											? 'rounded-r-full'
											: ''
							} ${
								currentPage === el
									? 'bg-gray-300 dark:bg-discord-dark-hover'
									: 'bg-gray-200 dark:bg-discord-black hover:bg-gray-300 dark:hover:bg-discord-dark-hover'
							}`}
						>
							{el}
						</a>
					</Link>
				))}
				<Link href={{ pathname, hash: 'list', query: { ...searchParams, page: currentPage + 1 } }}>
					<a
						className={`${
							currentPage === totalPage ? 'invisible' : ''
						} h-12 w-12 ml-1 flex justify-center items-center rounded-full transition duration-150 ease-in bg-gray-200 dark:bg-discord-black hover:bg-gray-300 dark:hover:bg-discord-dark-hover cursor-pointer text-center`}
					>
						<i className='fas fa-chevron-right'></i>
					</a>
				</Link>
			</div>
		</div>
	)
}

interface PaginatorProps {
	pathname: string
	currentPage: number
	totalPage: number
	searchParams?: Record<string, string|string[]>
}

export default Paginator
