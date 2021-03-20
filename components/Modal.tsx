import { ReactNode } from 'react'
import { Modal as ReactModal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'

const Modal = ({ children, isOpen, onClose, closeIcon=false, dark, header, full=false }: ModalProps): JSX.Element => {
	return (
		<ReactModal
			open={isOpen}
			onClose={onClose}
			center
			animationDuration={100}
			showCloseIcon={closeIcon}
			styles={{
				closeButton: {
					color: dark ? 'white' : 'black'
				},
				modal: {
					borderRadius: '10px',
					background: dark ? '#2C2F33' : '#fbfbfb',
					color: dark ? 'white' : 'black',
					width: full ? '90%' : 'inherit'
				},
			}}
		>
			<h2 className='text-lg font-bold uppercase'>{header}</h2>
			<div className='relative pt-4'>
				<div className={dark ? 'dark' : 'light'}>{children}</div>
			</div>
		</ReactModal>
	)
}

interface ModalProps {
	dark: boolean
	isOpen: boolean
	header?: string
	full?: boolean
	children: ReactNode
	closeIcon?: boolean
	onClose(): void
}

export default Modal
