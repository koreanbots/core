const Advertisement = (): JSX.Element => {

	return <div className={`z-0 mx-auto w-full text-center text-white ${process.env.NODE_ENV === 'production' ? '' : 'py-12 bg-gray-700'}`} style={{ height: '90px' }}>
		{
			process.env.NODE_ENV === 'production' ?  <ins
				className='adsbygoogle mb-5 w-full'
				style={{ display: 'inline-block', height: '90px' }}
				data-ad-client='ca-pub-4856582423981759'
				data-ad-slot='3250141451'
				data-adtest='on'
				data-full-width-responsive='true'
			></ins> : 'Advertisement'
		}</div>
}

export default Advertisement
