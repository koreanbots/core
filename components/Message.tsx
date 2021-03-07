import { MessageColor } from '@utils/Constants'
import Markdown from './Markdown'

const Message = ({ type, children }: MessageProps): JSX.Element => {
	return (
		<div
			className={`${MessageColor[type]} px-6 py-4 rounded-md text-base mx-auto w-full text-left`}
		>
			{ typeof children === 'string' ? <Markdown text={children} /> : children }
		</div>
	)
}

interface MessageProps {
	type?: 'success' | 'error' | 'warning' | 'info'
	children: JSX.Element | JSX.Element[] | string
}

export default Message
