import NextImage from 'next/image'

const DiscordImage = (props: { userID: string, avatarHash: string, tag: number|string, className?: string }) => {
	return <NextImage className={props.className} src={props.avatarHash ? `https://cdn.discordapp.com/avatars/${props.userID}/${props.avatarHash}.png?size=1024` : `https://cdn.discordapp.com/embed/avatars/${Number(props.tag) % 5}.png?size=1024`} width={512} height={512} onError={(e)=> e.target.src = '/img/default.png'}/>
}

export default DiscordImage
