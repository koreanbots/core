import AdSense from 'react-adsense'

const Advertisement: React.FC<AdvertisementProps> = ({ size = 'short' }) => {
	return null
	/*
	return (
		<div className='py-5'>
			<div
				className={`z-0 mx-auto w-full text-center text-white ${
					process.env.NODE_ENV === 'production' ? '' : 'bg-gray-700 py-12'
				}`}
				style={size === 'short' ? { height: '90px' } : { height: '330px' }}
			>
				{process.env.NODE_ENV === 'production' ? (
					<AdSense.Google
						style={{
							display: 'inline-block',
							width: '100%',
							height: size === 'short' ? '90px' : '330px',
						}}
						client='ca-pub-2436587688222951'
						slot=''
						format=''
					/>
				) : (
					'Advertisement'
				)}
			</div>
		</div>
	)
	*/
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
