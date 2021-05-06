import Link from 'next/link'
import { ReactNode } from 'react'

const Button = ({
	type = 'button',
	className,
	children,
	href,
	disabled=false,
	onClick,
}: ButtonProps): JSX.Element => {
	return href ? (
		<Link href={!disabled && href}>
			<a
				className={`cursor-pointer rounded-md px-4 py-2 transition duration-300 ease select-none outline-none foucs:outline-none mr-1.5 ${className ??
					'bg-discord-blurple hover:opacity-80 dark:bg-very-black dark:hover:bg-discord-dark-hover text-white'}`}
			>
				{children}
			</a>
		</Link>
	) : onClick ? (
		<button
			type={disabled ? 'button' : type}
			onClick={disabled ? null : onClick}
			className={`cursor-pointer rounded-md px-4 py-2 transition duration-300 ease select-none outline-none foucs:outline-none mr-1.5 ${className ??
				'bg-discord-blurple hover:opacity-80 dark:bg-very-black dark:hover:bg-discord-dark-hover text-white'}`}
		>
			{children}
		</button>
	) : (
		<button
			type={disabled ? 'button' : type}
			className={`cursor-pointer rounded-md px-4 py-2 transition duration-300 ease select-none outline-none foucs:outline-none mr-1.5 ${className ??
				'bg-discord-blurple hover:opacity-80 dark:bg-very-black dark:hover:bg-discord-dark-hover text-white'}`}
		>
			{children}
		</button>
	)
}

interface ButtonProps {
	type?: 'button' | 'submit' | 'reset'
	className?: string
	children: ReactNode
	href?: string
	disabled?: boolean
	onClick?: () => void
}

export default Button
