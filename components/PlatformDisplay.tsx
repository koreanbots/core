import { ReactNode } from 'react'

const PlatformDisplay = ({ osx, children }:PlatformDisplayProps): JSX.Element => {
	const isOSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
	return <>{isOSX ? osx ?? children : children}</>
}

interface PlatformDisplayProps {
  osx?: ReactNode
  children: ReactNode
}

export default PlatformDisplay