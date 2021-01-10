const Advertisement = (): JSX.Element => {
	if (process.env.NODE_ENV === 'production')
		return (
			<ins
				className="adsbygoogle mb-5 w-full"
				style={{ display: 'block' }}
				data-ad-client="ca-pub-4856582423981759"
				data-ad-slot="3250141451"
				data-ad-format="auto"
				data-adtest="on"
				data-full-width-responsive="true"
			></ins>
		)
	else
		return <div className="my-5 py-12 w-full text-center text-white bg-gray-700">Advertisement</div>
}

export default Advertisement
