import { SyntheticEvent, useEffect, useState } from 'react'
import { KoreanbotsEndPoints } from '@utils/Constants'
import { supportsWebP } from '@utils/Tools'
import Logger from '@utils/Logger'

const DiscordAvatar = (props: {
	alt?: string
	userID: string
	className?: string
	size? : 128 | 256 | 512
}) => {
	const fallback = '/img/default.png'
	const [ webpUnavailable, setWebpUnavailable ] = useState<boolean>()
	useEffect(()=> {
		setWebpUnavailable(localStorage.webp === 'false')
	}, [])
	return (
		<img
			alt={props.alt ?? 'Image'}
			loading='lazy'
			className={props.className}
			src={
				KoreanbotsEndPoints.CDN.avatar(props.userID, { format: !webpUnavailable ? 'webp' : 'png', size: props.size ?? 256})
			}
			onError={(e: SyntheticEvent<HTMLImageElement, ImageEvent>)=> {
				if(webpUnavailable) {
					(e.target as ImageTarget).onerror = (event) => {
						// All Fails
						(event.target as ImageTarget).onerror = ()=> { Logger.warn('FALLBACK IMAGE LOAD FAIL') }
						(event.target as ImageTarget).src = fallback
					
					}
				}
				else {
					(e.target as ImageTarget).onerror = (event) => {
						// All Fails
						(event.target as ImageTarget).onerror = ()=> { Logger.warn('FALLBACK IMAGE LOAD FAIL') }
						(event.target as ImageTarget).src = fallback
					}
					// Webp Load Fail
					(e.target as ImageTarget).src = KoreanbotsEndPoints.CDN.avatar(props.userID, { size: props.size ?? 256})
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