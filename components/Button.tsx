import Link from 'next/link'

const Button = ({ type='button', className='', children, href, onClick }: ButtonProps):JSX.Element => {
	return href ? <Link href={href}>
		<a className={`cursor-pointer bg-discord-blurple hover:opacity-80 dark:bg-very-black dark:hover:bg-discord-dark-hover text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none outline-none foucs:outline-none ${className}`}>
			{ children }
		</a>
	</Link> : onClick ? <button type={type} onKeyDown={onClick} onClick={onClick} className={`cursor-pointer bg-discord-blurple hover:opacity-80 dark:bg-very-black dark:hover:bg-discord-dark-hover text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none outline-none foucs:outline-none ${className}`}>
		{ children }
	</button> : <button type={type} className={`cursor-pointer bg-discord-blurple hover:opacity-80 dark:bg-very-black dark:hover:bg-discord-dark-hover text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none outline-none foucs:outline-none ${className}`}>
		{ children }
	</button>
}

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  className?: string
  children: JSX.Element | JSX.Element[] | string
  href?: string
  onClick?: () => void
}

export default Button