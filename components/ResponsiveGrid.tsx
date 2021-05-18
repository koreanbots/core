const ResponsiveGrid: React.FC = ({ children }) => {
	return <div className='grid gap-x-4 grid-rows-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 -mb-10'>
		{children}
	</div>
}

export default ResponsiveGrid