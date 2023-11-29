import { ReactNode } from 'react'

const PlatformDisplay: React.FC<PlatformDisplayProps> = ({
	osx,
	children,
}: PlatformDisplayProps) => {
	const isOSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
	return <>{isOSX ? osx ?? children : children}</>
}

interface PlatformDisplayProps {
	osx?: ReactNode
	children: ReactNode
}

export default PlatformDisplay
