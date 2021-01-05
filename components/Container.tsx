const Container = ({ ignoreColor, className, children }:ContainerProps): JSX.Element => {
	return (
		<div className={ignoreColor ? null : 'bg-white dark:bg-discord-dark text-black dark:text-gray-100'}>
			<div className={`container mx-auto px-4 ${className}`}>
				{children}
			</div>
		</div>
	)
}

interface ContainerProps {
  ignoreColor?: boolean
  className?: string
  children: JSX.Element | JSX.Element[]
}

export default Container