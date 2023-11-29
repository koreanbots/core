import Link from 'next/link'
import { ReactNode } from 'react'

const Button: React.FC<ButtonProps> = ({
	type = 'button',
	className,
	children,
	href,
	disabled = false,
	onClick,
}) => {
	return href ? (
		<Link
			href={!disabled && href}
			className={`ease foucs:outline-none mr-1.5 cursor-pointer select-none rounded-md px-4 py-2 outline-none transition duration-300 ${
				className ??
				'bg-discord-blurple text-white hover:opacity-80 dark:bg-very-black dark:hover:bg-discord-dark-hover'
			}`}
		>
			{children}
		</Link>
	) : onClick ? (
		<button
			type={disabled ? 'button' : type}
			onClick={disabled ? null : onClick}
			className={`ease foucs:outline-none mr-1.5 cursor-pointer select-none rounded-md px-4 py-2 outline-none transition duration-300 ${
				className ??
				'bg-discord-blurple text-white hover:opacity-80 dark:bg-very-black dark:hover:bg-discord-dark-hover'
			}`}
		>
			{children}
		</button>
	) : (
		<button
			type={disabled ? 'button' : type}
			className={`ease foucs:outline-none mr-1.5 cursor-pointer select-none rounded-md px-4 py-2 outline-none transition duration-300 ${
				className ??
				'bg-discord-blurple text-white hover:opacity-80 dark:bg-very-black dark:hover:bg-discord-dark-hover'
			}`}
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
