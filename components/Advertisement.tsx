import AdSense from 'react-adsense'

const Advertisement: React.FC<AdvertisementProps> = ({ size = 'short' }) => {
	return null
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
