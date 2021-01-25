import Link from 'next/link'
const Paginator = ({ currentPage, totalPage }:PaginatorProps):JSX.Element => {
	const pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPage ]
	return <div className='flex flex-col items-center my-12 text-center justify-center'>
		<div className='flex text-gray-700 dark:text-gray-400'>
			<Link href={{ pathname: '/list/votes', query: { page: currentPage - 1} }}>
				<a className={`${currentPage === 1 ? 'hidden' : ''} h-12 w-12 mr-1 flex justify-center items-center rounded-full transition duration-150 ease-in bg-gray-200 dark:bg-discord-black hover:bg-gray-400 dark:hover:bg-discord-dark-hover cursor-pointer text-center`}>
					<i className='fas fa-chevron-left'></i>
				</a>
			</Link>
			<div className='flex h-12 font-medium rounded-full bg-gray-200 dark:bg-discord-black'>
				<a className={`w-12 md:flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in rounded-l-full ${pages[0] === currentPage ? 'bg-gray-400 dark:bg-discord-dark-hover' : ' hover:bg-gray-400 dark:hover:bg-discord-dark-hover'}`}>{pages[0]}</a>
				{
					pages[1] - pages[0] <= 1 ? '' : <>
						<a className='w-12 md:flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in'>...</a>
						<a className='w-12 md:flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in hover:bg-gray-400 dark:hover:bg-discord-dark-hover'>{pages[1]}</a>
					</>
				}
				<a className={`w-12 md:flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in ${currentPage === 1 || currentPage === totalPage ? 'hover:bg-gray-400 dark:hover:bg-discord-dark-hover' : 'bg-gray-400 dark:bg-discord-dark-hover '}`}>{pages[2] === pages[4] ? pages[4] - 1 : pages[2]}</a>
				{
					pages[4] - pages[3] <= 1 ? '' : <>
						<a className='w-12 md:flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in hover:bg-gray-400 dark:hover:bg-discord-dark-hover'>{pages[3]}</a>
						<a className='w-12 md:flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in'>...</a>
					</>
				}
				<a className={`w-12 md:flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in rounded-r-full ${pages[4] === currentPage ? 'bg-gray-400 dark:bg-discord-dark-hover' : ' hover:bg-gray-400 dark:hover:bg-discord-dark-hover'}`}>{pages[4]}</a>
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