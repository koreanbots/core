import { useEffect } from 'react'

const Advertisement = (): JSX.Element => {
	useEffect(() => {
		if(process.env.NODE_ENV === 'production')  window.adsbygoogle.push({})
	})
	
	return <div className={`z-0 m-auto h-32 w-full text-center text-white ${process.env.NODE_ENV === 'production' ? '' : 'py-12 bg-gray-700'}`}>
		{
			process.env.NODE_ENV === 'production' ?  <ins
				className='adsbygoogle mb-5 w-full'
				style={{ display: 'block' }}
				data-ad-client='ca-pub-4856582423981759'
				data-ad-slot='3250141451'
				data-ad-format='auto'
				data-adtest='on'
				data-full-width-responsive='true'
			></ins> : 'Advertisement'
		}</div>
}

declare global {
	interface Window { adsbygoogle: {
		loaded: boolean
		push(obj: unknown): void
	} }
}

export default Advertisement
