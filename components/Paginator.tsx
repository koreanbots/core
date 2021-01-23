import Link from 'next/link'

const Paginator = ({ currentPage, totalPage }:PaginatorProps):JSX.Element => {
	const pages = [currentPage === 1 ? 2 : currentPage === 2 ? 1 : currentPage - 2, currentPage === 1 || currentPage === 2 ? 3 : currentPage - 1, currentPage, currentPage === 1 || currentPage === 2 ? 4 : currentPage + 1, currentPage === 1 || currentPage === 2 ? 5 : currentPage + 2]
	return <div className='flex flex-col items-center my-12 text-center justify-center'>
		<div className='flex text-gray-700 dark:text-gray-400'>
			<Link href={{ pathname: '/list/votes', query: { page: currentPage - 1} }}>
				<a className={`${currentPage === 1 ? 'hidden' : ''} h-12 w-12 mr-1 flex justify-center items-center rounded-full transition duration-150 ease-in bg-gray-200 dark:bg-discord-black hover:bg-gray-400 dark:hover:bg-discord-dark-hover cursor-pointer text-center`}>
					<i className='fas fa-chevron-left'></i>
				</a>
			</Link>
			<div className='flex h-12 font-medium rounded-full bg-gray-200 dark:bg-discord-black'>
				<a className={`w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in hover:bg-gray-400 dark:hover:bg-discord-dark-hover order-1${currentPage === 1 ? '' : ' rounded-l-full'}`}>{pages[0]}</a>
				<a className={`w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in hover:bg-gray-400 dark:hover:bg-discord-dark-hover order-6${(pages[3]) >= totalPage ? ' rounded-r-full' : ''}`}>{pages[1]}</a>
				<a className={`w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in bg-gray-300 dark:bg-very-black text-gray-900 dark:text-white ${currentPage === 1 ? 'order-first rounded-l-full' : currentPage === 2 ? 'order-2' : 'order-7'}`}>{pages[2]}</a>
				<a className={`${(pages[3]) >= totalPage ? 'hidden ' : `md:flex ${(pages[4]) >= totalPage ? 'rounded-r-full' : ''}`}w-12 justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in hover:bg-gray-400 dark:hover:bg-discord-dark-hover order-8`}>{pages[3]}</a>
				<a className={`${(pages[4]) >= totalPage ? 'hidden ' : 'md:flex rounded-r-full'}w-12 justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in hover:bg-gray-400 dark:hover:bg-discord-dark-hover order-9`}>{pages[4]}</a>
				<a className='w-12 h-12 md:hidden flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-discord-dark-hover'>{pages[2]}</a>
			</div>
			<Link href={{ pathname: '/list/votes', query: { page: currentPage + 1} }}>
				<a className={`${currentPage === totalPage ? 'hidden' : '' } h-12 w-12 ml-1 flex justify-center items-center rounded-full transition duration-150 ease-in bg-gray-200 dark:bg-discord-black hover:bg-gray-400 dark:hover:bg-discord-dark-hover cursor-pointer text-center`}>
					<i className='fas fa-chevron-right'></i>
				</a>
			</Link>
		</div>
	</div>
 
}

interface PaginatorProps {
  currentPage: number
  totalPage: number
}

export default Paginator