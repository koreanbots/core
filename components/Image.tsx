import { SyntheticEvent, useEffect, useState } from 'react'
import { supportsWebP } from '@utils/Tools'
import Logger from '@utils/Logger'

const BaseImage: React.FC<ImageProps> = props => {
	const fallback = '/img/default.png'
	const [ webpUnavailable, setWebpUnavailable ] = useState<boolean>()
	
	useEffect(()=> {
		setWebpUnavailable(localStorage.webp === 'false')
	}, [])
	
	return <img
		alt={props.alt ?? 'Image'}
		loading='lazy'
		className={props.className}
		src={
			webpUnavailable && props.fallbackSrc || props.src
		}
		onError={(e: SyntheticEvent<HTMLImageElement, ImageEvent>)=> {
			if(webpUnavailable) {
				(e.target as ImageTarget).onerror = (event) => {
					// All Fails
					(event.target as ImageTarget).onerror = () => { Logger.warn('FALLBACK IMAGE LOAD FAIL') }
					(event.target as ImageTarget).src = fallback
					
				}
			}
			else if (props.fallbackSrc) {
				(e.target as ImageTarget).onerror = (event) => {
					// All Fails
					(event.target as ImageTarget).onerror = () => { Logger.warn('FALLBACK IMAGE LOAD FAIL') }
					(event.target as ImageTarget).src = fallback
				}
				// Webp Load Fail
				(e.target as ImageTarget).src = props.fallbackSrc
				if(!supportsWebP()) localStorage.setItem('webp', 'false')
			}
			else {
				(e.target as ImageTarget).src = fallback
			}
		}}
	/>
}

interface ImageProps {
	alt?: string
	className?: string
	src: string
	fallbackSrc?: string
}

interface ImageEvent extends Event {
	target: ImageTarget
}

interface ImageTarget extends EventTarget {
	src: string
	onerror: (event: SyntheticEvent<HTMLImageElement, ImageEvent>) => void
}

export default BaseImage
