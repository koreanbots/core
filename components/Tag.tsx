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
}: LabelProps): JSX.Element => {
	return href ? (
		<Link href={href}>
			<a
				className={`${className ?? ''} text-center text-base  ${
					dark
						? blurple
							? 'bg-discord-blurple'
							: 'bg-little-white-hover dark:bg-very-black'
						: github
						? 'bg-gray-900 text-white'
						: 'bg-little-white dark:bg-discord-black'
				} ${!blurple && !github ? 'text-black dark:text-gray-400' : ''} ${
					circular ? 'rounded-3xl px-2.5 py-1.5' : 'rounded px-2 py-1'
				} mr-1 mb-${marginBottom} hover:bg-little-white-hover dark:hover:bg-discord-dark-hover`}
			>
				{text}
			</a>
		</Link>
	) : (
		<a
			className={`${className ?? ''} text-center text-base ${
				dark
					? blurple
						? 'font-bg text-white bg-discord-blurple text-black'
						: github
						? 'bg-gray-900 text-white'
						: 'bg-little-white-hover dark:bg-very-black'
					: 'bg-little-white dark:bg-discord-black'
			} ${!blurple && !github ? 'text-black dark:text-gray-400' : ''} ${
				circular ? 'rounded-3xl px-2.5 py-1.5' : 'rounded px-2 py-1'
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
}

export default Tag
