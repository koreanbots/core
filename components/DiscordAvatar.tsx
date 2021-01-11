import { SyntheticEvent } from 'react'
import { ImageSize } from '../types'
import { DiscordEnpoints } from '../utils/Constants'

const DiscordAvatar = (props: {
	alt?: string
	userID: string
	avatarHash: string
	tag: string
	className?: string
	size? : ImageSize
}) => {
	const fallback ='/img/default.png'
	const webp = localStorage.webp === 'true'
	return (
		<img
			alt={props.alt ?? 'IMage'}
			className={props.className}
			src={
				props.avatarHash
					? DiscordEnpoints.CDN.user(props.userID, props.avatarHash, { format: webp ? 'webp' : 'png', size: props.size ?? 256})
					: DiscordEnpoints.CDN.default(props.tag, { format: webp ? 'webp' : 'png', size: props.size ?? 256})
			}
			onError={(e: SyntheticEvent<HTMLImageElement, ImageEvent>)=> {
				if(webp) {
					(e.target as ImageTarget).onerror = (event) => {
						// All Fails
						(event.target as ImageTarget).onerror = ()=> { console.log('FALLBACK IMAGE LOAD FAIL') }
						(event.target as ImageTarget).src = fallback
					}
					// Webp Load Fail
					(e.target as ImageTarget).src = props.avatarHash
						? DiscordEnpoints.CDN.user(props.userID, props.avatarHash, { size: props.size ?? 256 })
						: DiscordEnpoints.CDN.default(props.tag, { size: props.size ?? 256})
				}
				else (e.target as ImageTarget).onerror = (event) => {
					// All Fails
					(event.target as ImageTarget).onerror = ()=> { console.log('FALLBACK IMAGE LOAD FAIL') }
					(event.target as ImageTarget).src = fallback
				}
				// Webp Load Fail
				(e.target as ImageTarget).src = props.avatarHash
					? DiscordEnpoints.CDN.user(props.userID, props.avatarHash, { size: props.size ?? 256 }) 
					: DiscordEnpoints.CDN.default(props.tag, { size: props.size ?? 256})
					
			}}
		/>	
	)
}

export default DiscordAvatar

interface ImageEvent extends Event {
	target: ImageTarget
}

interface ImageTarget extends EventTarget {
	src: string
	onerror: (event: SyntheticEvent<HTMLImageElement, ImageEvent>) => void
}