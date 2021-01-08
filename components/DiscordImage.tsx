import NextImage from 'next/image'

const DiscordImage = (props: {
	size?: number
	userID: string
	avatarHash: string
	tag: number | string
	className?: string
}) => {
	return (
		<NextImage
			className={props.className}
			src={
				props.avatarHash
					? `https://cdn.discordapp.com/avatars/${props.userID}/${props.avatarHash}.png?size=1024`
					: `https://cdn.discordapp.com/embed/avatars/${Number(props.tag) % 5}.png?size=1024`
			}
			width={props.size || 256}
			height={props.size || 256}
			data-fallback-image="/img/default.png"
		/>
	)
}

export default DiscordImage
