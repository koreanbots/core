/* eslint-disable jsx-a11y/no-static-element-interactions */
import Link from 'next/link'

const LongButton: React.FC<LongButtonProps> = ({
	children,
	newTab = false,
	href,
	onClick,
	center = false,
}) => {
	if (href) {
		if (newTab)
			return (
				<a href={href} rel='noopener noreferrer' target='_blank'>
					<div
						className={`${
							center ? 'justify-center ' : ''
						}text-base mb-1 flex cursor-pointer rounded bg-little-white px-4 py-4 text-black hover:bg-little-white-hover dark:bg-discord-black dark:text-gray-400 dark:hover:bg-discord-dark-hover`}
					>
						{children}
					</div>
				</a>
			)
		else
			return (
				<Link
					href={href}
					className={`${
						center ? 'justify-center ' : ''
					}text-base mb-1 flex cursor-pointer rounded bg-little-white px-4 py-4 text-black hover:bg-little-white-hover dark:bg-discord-black dark:text-gray-400 dark:hover:bg-discord-dark-hover`}
				>
					{children}
				</Link>
			)
	}
	if (onClick)
		return (
			<div
				onKeyPress={onClick}
				onClick={onClick}
				className={`${
					center ? 'justify-center ' : ''
				}text-base mb-1 flex cursor-pointer rounded bg-little-white px-4 py-4 text-black hover:bg-little-white-hover dark:bg-discord-black dark:text-gray-400 dark:hover:bg-discord-dark-hover`}
			>
				{children}
			</div>
		)

	return (
		<a
			className={`${
				center ? 'justify-center ' : ''
			}text-base mb-1 flex cursor-pointer rounded bg-little-white px-4 py-4 text-black hover:bg-little-white-hover dark:bg-discord-black dark:text-gray-400 dark:hover:bg-discord-dark-hover`}
		>
			{children}
		</a>
	)
}

export default LongButton

interface LongButtonProps {
	newTab?: boolean
	onClick?: (event: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => void
	children: string | JSX.Element | JSX.Element[]
	href?: string
	center?: boolean
}
