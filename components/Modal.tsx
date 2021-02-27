import { ReactNode } from 'react'
import { Modal as ReactModal} from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'

const Modal = ({ children, isOpen, onClose, dark, header }:ModalProps):JSX.Element => {
	return <ReactModal open={isOpen} onClose={onClose} center animationDuration={100} classNames={{
		modal: 'bg-discord-dark'
	}}
	showCloseIcon={false}
	styles={{
		modal: {
			borderRadius: '10px',
			background: dark ? '#2C2F33' : '#fbfbfb',
			color: dark ? 'white' : 'black',
			minWidth: '500px'
		}
	}}
	>
		<h2 className='text-lg font-black uppercase'>{header}</h2>
		<div className='pt-4 relative'>
			<div>
				{children}
			</div>
		</div>
	</ReactModal>
}

interface ModalProps {
  dark: boolean
  isOpen: boolean
  header?: string
  children: ReactNode
  onClose(): void
}

export default Modal