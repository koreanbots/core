import { MessageColor } from '@utils/Constants'
import Markdown from './Markdown'

const Message: React.FC<MessageProps> = ({ type, children }) => {
	return (
		<div
			className={`${MessageColor[type]} mx-auto w-full rounded-md px-6 py-4 text-left text-base`}
		>
			{typeof children === 'string' ? <Markdown text={children} /> : children}
		</div>
	)
}

interface MessageProps {
	type?: 'success' | 'error' | 'warning' | 'info'
	children: JSX.Element | JSX.Element[] | string
}

export default Message
