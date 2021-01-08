const Divider = ({ className }: { className?: string }) => {
	return (
		<div
			className={`my-2 px-5 ${className || ''}`}
			style={{
				borderTop: '1px solid rgba(34,36,38,.15)',
				borderBottom: '1px solid hsla(0,0%,100%,.1)',
			}}
		/>
	)
}

export default Divider
