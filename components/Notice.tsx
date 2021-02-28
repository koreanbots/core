const Notice = ({ header, desc }: NoticeProps) => {
	return (
		<div className='mx-auto my-auto px-10 py-48 h-screen text-center'>
			<h1 className='text-4xl font-bold'>KOREANBOTS</h1>
			<br />
			<div>
				<h1 className='mb-10 text-3xl font-bold'>{header}</h1>

				<h2 className='text-lg font-semibold'>{desc}</h2>
				<br />
			</div>
		</div>
	)
}

export default Notice

interface NoticeProps {
	header: string
	desc: string
}
