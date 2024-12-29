import { SyntheticEvent } from 'react'
import dynamic from 'next/dynamic'
import { KoreanbotsEndPoints } from '@utils/Constants'

const Image = dynamic(() => import('@components/Image'))

const DiscordAvatar: React.FC<DiscordAvatarProps> = (props) => {
	return (
		<Image
			{...props}
			src={KoreanbotsEndPoints.CDN.avatar(props.userID, {
				format: 'webp',
				size: props.size ?? 256,
				hash: props.hash,
			})}
			fallbackSrc={KoreanbotsEndPoints.CDN.avatar(props.userID, {
				format: 'png',
				size: props.size ?? 256,
				hash: props.hash,
			})}
		/>
	)
}

interface DiscordAvatarProps {
	alt?: string
	userID: string
	className?: string
	size?: 128 | 256 | 512
	hash?: string
}

interface ImageEvent extends Event {
	target: ImageTarget
}

interface ImageTarget extends EventTarget {
	src: string
	onerror: (event: SyntheticEvent<HTMLImageElement, ImageEvent>) => void
}

export default DiscordAvatar
