const Advertisement = ():JSX.Element => {
	if(process.env.NODE_ENV === 'production') return <ins className="mb-5 adsbygoogle"
		style={{ display: 'block' }}
		data-ad-client="ca-pub-4856582423981759"
		data-ad-slot="3250141451"
		data-ad-format="auto"
		data-adtest="on"
		data-full-width-responsive="true"></ins>
	else return <div className='bg-gray-700 text-white text-center w-full py-12 my-5'>Advertisement</div>
}

export default Advertisement