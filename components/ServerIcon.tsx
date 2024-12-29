import { SyntheticEvent } from 'react'
import dynamic from 'next/dynamic'
import { KoreanbotsEndPoints } from '@utils/Constants'

const Image = dynamic(() => import('@components/Image'))

const ServerIcon: React.FC<ServerIconProps> = ({ id, size, className, alt, hash }) => {
	return (
		<Image
			className={className}
			alt={alt}
			src={KoreanbotsEndPoints.CDN.icon(id, { format: 'webp', size: size ?? 256, hash })}
			fallbackSrc={KoreanbotsEndPoints.CDN.icon(id, { format: 'png', size: size ?? 256, hash })}
		/>
	)
}

interface ServerIconProps {
	alt?: string
	id: string
	hash?: string
	fromDiscord?: boolean
	className?: string
	size?: 128 | 256 | 512
}

interface ImageEvent extends Event {
	target: ImageTarget
}

interface ImageTarget extends EventTarget {
	src: string
	onerror: (event: SyntheticEvent<HTMLImageElement, ImageEvent>) => void
}

export default ServerIcon
