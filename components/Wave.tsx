const Wave = ({ color, className }: WaveProps): JSX.Element => {
	return (
		<svg viewBox='0 0 1440 320' className={className}>
			<path
				fill={color}
				d='M0 192l34.3 5.3C68.6 203 137 213 206 186.7c68.3-26.7 137-90.7 205-96 69-5.7 138 48.3 206 90.6C685.7 224 754 256 823 272c68.4 16 137 16 206 0 68.1-16 137-48 205-69.3 68.9-21.7 137-31.7 172-37.4l34-5.3V0H0z'
			/>
		</svg>
	)
}

interface WaveProps {
	color: string
	className?: string
}

export default Wave
