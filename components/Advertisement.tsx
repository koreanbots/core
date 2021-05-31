import { useEffect } from 'react'
import Logger from '@utils/Logger'

const Advertisement: React.FC<AdvertisementProps> = ({ size = 'short' }) => {
	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			window.adsbygoogle = window.adsbygoogle || []
			try {
				window.adsbygoogle.push({})
				Logger.debug('Ad Pushed')
			}
			catch {
				Logger.debug('Ad Push Fail')
			}
		}
		
	}, [])

	return <div className='py-5'>
		<div
			className={`z-0 mx-auto w-full text-center text-white ${
				process.env.NODE_ENV === 'production' ? '' : 'py-12 bg-gray-700'
			}`}
			style={size === 'short' ? { height: '90px' } : { height: '330px' }}
		>
			{process.env.NODE_ENV === 'production' ? (
				<ins
					className='adsbygoogle'
					style={{ display: 'block', width: '100%' }}
					data-ad-client='ca-pub-4856582423981759'
					data-ad-slot='3250141451'
					data-ad-format={size === 'short' ? 'horizontal' : 'vertical'}
					data-full-width-responsive='true'
					data-adtest='on'
				/>
			) : (
				'Advertisement'
			)}
		</div>
	</div>
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
