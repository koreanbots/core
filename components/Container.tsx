const Container = ({ className, children }:ContainerProps): JSX.Element => {
	return (
		<div className={`container mx-auto px-4 ${className}`}>
			{children}
		</div>
	)
}

interface ContainerProps {
  className?: string
  children: JSX.Element | JSX.Element[]
}

export default Container