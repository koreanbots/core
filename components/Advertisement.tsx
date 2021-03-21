import Logger from '@utils/Logger'
import { useEffect } from 'react'

const Advertisement = ({ size = 'short' }: AdvertisementProps): JSX.Element => {
	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			window.adsbygoogle = window.adsbygoogle || []
			window.adsbygoogle.push({})
		}
		Logger.debug('Ads Pushed')
	}, [])

	return (
		<div
			className={`z-0 mx-auto w-full text-center text-white ${
				process.env.NODE_ENV === 'production' ? '' : 'py-12 bg-gray-700'
			}`}
			style={size === 'short' ? { height: '90px' } : { height: '330px' }}
		>
			{process.env.NODE_ENV === 'production' ? (
				<ins
					className='adsbygoogle w-full'
					style={{ display: 'inline-block', height: '90px' }}
					data-ad-client='ca-pub-4856582423981759'
					data-ad-slot='3250141451'
					data-adtest='on'
					data-full-width-responsive='true'
				></ins>
			) : (
				'Advertisement'
			)}
		</div>
	)
}

declare global {
	interface Window {
		adsbygoogle: {
			loaded?: boolean
			push(obj: unknown): void
		}
	}
}

interface AdvertisementProps {
	size?: 'short' | 'tall'
}

export default Advertisement
