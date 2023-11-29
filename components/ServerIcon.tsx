import { SyntheticEvent } from 'react'
import dynamic from 'next/dynamic'
import { DiscordEnpoints, KoreanbotsEndPoints } from '@utils/Constants'

const Image = dynamic(() => import('@components/Image'))

const ServerIcon: React.FC<ServerIconProps> = ({ id, size, className, alt, hash }) => {
	return (
		<Image
			className={className}
			alt={alt}
			src={
				hash
					? DiscordEnpoints.CDN.guild(id, hash, { format: 'webp', size: size ?? 256 })
					: KoreanbotsEndPoints.CDN.icon(id, { format: 'webp', size: size ?? 256 })
			}
			fallbackSrc={
				hash
					? DiscordEnpoints.CDN.guild(id, hash, { format: 'png', size: size ?? 256 })
					: KoreanbotsEndPoints.CDN.icon(id, { format: 'png', size: size ?? 256 })
			}
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
