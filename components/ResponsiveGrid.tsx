const ResponsiveGrid: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<div className='-mb-10 mt-10 grid grid-rows-1 gap-x-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{children}
		</div>
	)
}

export default ResponsiveGrid
