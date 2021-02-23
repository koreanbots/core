import { MessageColor } from '@utils/Constants'

const Message = ({ type, children }:MessageProps):JSX.Element => {
	return <div className={`${MessageColor[type]} px-6 py-4 rounded-md text-base mx-auto w-full text-left`}>
		{children}
	</div>
}

interface MessageProps{
  type?: 'success' | 'error' | 'warning' | 'info'
  children: JSX.Element | JSX.Element[] | string
}

export default Message