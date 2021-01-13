const Notice = ({ header, desc }:NoticeProps) => {
	return (
		<div className='py-48 px-10 mx-auto my-auto h-screen text-center'>
			<h1 className='text-4xl font-bold'>KOREANBOTS</h1>
			<br />
			<div>
				<h1 className='text-3xl font-bold mb-10'>{header}</h1>
	
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