import { RefObject, useEffect } from 'react'

const useOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void) => {
	const handleClick = e => {
		if (ref.current && !ref.current.contains(e.target)) {
			callback()
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleClick)

		return () => {
			document.removeEventListener('click', handleClick)
		}
	})
}

export default useOutsideClick
