import { SyntheticEvent, useEffect, useState } from 'react'
import { ImageSize } from '../types'
import { DiscordEnpoints } from '../utils/Constants'
import { supportsWebP } from '../utils/Tools'

const DiscordAvatar = (props: {
	alt?: string
	userID: string
	avatarHash: string
	tag: string
	className?: string
	size? : ImageSize
}) => {
	const fallback = '/img/default.png'
	const [ webpUnavailable, setWebpUnavailable ] = useState<boolean>()
	useEffect(()=> {
		setWebpUnavailable(localStorage.webp === 'false')
	}, [])
	return (
		<img
			alt={props.alt ?? 'Image'}
			className={props.className}
			src={
				props.avatarHash
					? DiscordEnpoints.CDN.user(props.userID, props.avatarHash, { format: !webpUnavailable ? 'webp' : 'png', size: props.size ?? 256})
					: DiscordEnpoints.CDN.default(props.tag, { format: !webpUnavailable ? 'webp' : 'png', size: props.size ?? 256})
			}
			onError={(e: SyntheticEvent<HTMLImageElement, ImageEvent>)=> {
				if(webpUnavailable) {
					(e.target as ImageTarget).onerror = (event) => {
						// All Fails
						(event.target as ImageTarget).onerror = ()=> { console.log('FALLBACK IMAGE LOAD FAIL') }
						(event.target as ImageTarget).src = fallback
					
					}
				}
				else {
					(e.target as ImageTarget).onerror = (event) => {
						// All Fails
						(event.target as ImageTarget).onerror = ()=> { console.log('FALLBACK IMAGE LOAD FAIL') }
						(event.target as ImageTarget).src = fallback
					}
					// Webp Load Fail
					(e.target as ImageTarget).src = props.avatarHash
						? DiscordEnpoints.CDN.user(props.userID, props.avatarHash, { size: props.size ?? 256 })
						: DiscordEnpoints.CDN.default(props.tag, { size: props.size ?? 256})
					if(!supportsWebP()) localStorage.setItem('webp', 'false')
				}
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