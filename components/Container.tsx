const Container = ({
	ignoreColor,
	className,
	paddingTop = false,
	children,
}: ContainerProps): JSX.Element => {
	return (
		<div
			className={`${
				ignoreColor ? '' : 'bg-white dark:bg-discord-dark text-black dark:text-gray-100'
			} ${paddingTop ? 'pt-20' : ''}`}
		>
			<div className={`container mx-auto px-4 ${className}`}>{children}</div>
		</div>
	)
}

interface ContainerProps {
	ignoreColor?: boolean
	className?: string
	paddingTop?: boolean
	children: JSX.Element | JSX.Element[]
}

export default Container
