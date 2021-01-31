import Link from 'next/link'

const Tag = ({
	blurple = false,
	github = false,
	href,
	text,
	className,
	circular = false,
	dark = false,
	marginBottom = 2,
	newTab = false,
	bigger = false,
	...props
}: LabelProps): JSX.Element => {
	return href ? newTab ? (
		<a
			href={href}
			rel='noopener noreferrer'
			target='_blank'
			className={`${className ?? ''} text-center text-base ${
				dark
					? blurple
						? 'bg-discord-blurple'
						: 'bg-little-white-hover hover:bg-little-white dark:bg-very-black'
					: github
						? 'bg-gray-900 text-white'
						: 'bg-little-white dark:bg-discord-black hover:bg-little-white-hover'
			} ${!blurple && !github ? 'text-black dark:text-gray-400' : ''} ${
				circular ? `rounded-3xl ${bigger ? 'px-3.5 py-2.5' : 'px-2.5 py-1.5'}` : `rounded ${bigger ? 'px-3 py-2' : 'px-2 py-1'}`
			} mr-1 mb-${marginBottom} dark:hover:bg-discord-dark-hover transition duration-100 ease-in`}
		>
			{text}
		</a>

	) : (
		<Link href={href}>
			<a
				className={`${className ?? ''} text-center text-base  ${
					dark
						? blurple
							? 'bg-discord-blurple'
							: 'bg-little-white-hover hover:bg-little-white dark:bg-very-black'
						: github
							? 'bg-gray-900 text-white'
							: 'bg-little-white dark:bg-discord-black hover:bg-little-white-hover'
				} ${!blurple && !github ? 'text-black dark:text-gray-400' : 'hover:bg-little-white-hover'} ${
					circular ? `rounded-3xl ${bigger ? 'px-3.5 py-2.5' : 'px-2.5 py-1.5'}` : `rounded ${bigger ? 'px-3 py-2' : 'px-2 py-1'}`
				} mr-1 mb-${marginBottom} dark:hover:bg-discord-dark-hover transition duration-100 ease-in`}
			>
				{text}
			</a>
		</Link>
	) : (
		<a
			{...props}
			className={`${className ?? ''} text-center text-base ${
				dark
					? blurple
						? 'font-bg dark:text-white bg-discord-blurple text-black'
						: github
							? 'bg-gray-900 text-white'
							: 'bg-little-white-hover dark:bg-very-black'
					: `bg-little-white dark:bg-discord-black ${props.onClick ? 'hover:bg-little-white-hover dark:hover:bg-discord-dark-hover transition duration-100 ease-in' : '' }`
			} ${!blurple && !github ? 'text-black dark:text-gray-400' : ''} ${
				circular ? `rounded-3xl ${bigger ? 'px-3.5 py-2.5' : 'px-2.5 py-1.5'}` : `rounded ${bigger ? 'px-3 py-2' : 'px-2 py-1'}`
			} mr-1 mb-${marginBottom}`}
		>
			{text}
		</a>
	)
}

interface LabelProps {
	blurple?: boolean
	github?: boolean
	href?: string
	text: string | JSX.Element | JSX.Element[]
	className?: string
	icon?: string
	circular?: boolean
	dark?: boolean
	marginBottom?: number
	newTab?: boolean
	bigger?: boolean
	[key: string]: unknown
}

export default Tag
