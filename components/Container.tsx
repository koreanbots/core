import { ReactNode } from 'react'

const Container: React.FC<ContainerProps> = ({
	ignoreColor,
	className,
	paddingTop = false,
	children,
}) => {
	return (
		<div
			className={`${ignoreColor ? '' : 'text-black dark:text-gray-100'} ${
				paddingTop ? 'pt-20' : ''
			}`}
		>
			<div className={`container mx-auto px-4 ${className}`}>{children}</div>
		</div>
	)
}

interface ContainerProps {
	ignoreColor?: boolean
	className?: string
	paddingTop?: boolean
	children: ReactNode
}

export default Container
