import Fetch from '@utils/Fetch'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken as getFirebaseToken } from 'firebase/messaging'
import { useState } from 'react'
import Button from './Button'

export async function getFCMToken() {
	try {
		const app = initializeApp({
			apiKey: 'AIzaSyDWnwXCBaP1C627gfIBQxyZbmNnAU_b_1Q',
			authDomain: 'koreanlist-e95d9.firebaseapp.com',
			projectId: 'koreanlist-e95d9',
			storageBucket: 'koreanlist-e95d9.firebasestorage.app',
			messagingSenderId: '716438516411',
			appId: '1:716438516411:web:cddd6c7cc3b0571fa4af9e',
		})

		const worker = await navigator.serviceWorker.register('/vote-notification-sw.js')

		const messaging = getMessaging(app)
		const token = await getFirebaseToken(messaging, {
			vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
			serviceWorkerRegistration: worker,
		})
		return token
	} catch (e) {
		return null
	}
}

function SetNotification({ id, notificationSet }: { id: string; notificationSet: boolean }) {
	const [state, setState] = useState(notificationSet ? 1 : 0)
	const [hold, setHold] = useState(false)

	const getToken = async () => {
		if (!('serviceWorker' in navigator)) {
			setState(4)
			return 'NO_SERVICE_WORKER'
		}

		if (!('Notification' in window)) {
			setState(4)
			return 'NO_NOTIFICATION'
		}

		const p = await Notification.requestPermission()
		if (p !== 'granted') {
			setState(5)
			return 'PERMISSION_DENIED'
		}

		const token = await getFCMToken()

		if (!token) {
			setState(4)
			return
		}

		const result = await Fetch('/users/notification', {
			method: 'POST',
			body: JSON.stringify({
				token,
				targetId: id,
			}),
		})

		if (result.code === 200) {
			setState(2)
		} else {
			setState(4)
		}
	}
	const components = {
		0: (
			<>
				<p className='whitespace-pre-line text-lg font-normal'>
					12시간 후에 이 기기로 알림을 받으려면 아래 버튼을 눌러주세요.
				</p>
				<Button
					disabled={hold}
					onClick={() => {
						setHold(true)
						getToken()
							.then(() => {
								setHold(false)
							})
							.catch(() => {
								setState(4)
							})
					}}
				>
					<>
						<i className='far fa-bell' /> {hold ? '설정 중...' : '알림 설정'}
					</>
				</Button>
			</>
		),
		1: (
			<>
				<p className='whitespace-pre-line text-lg font-normal'>
					이 기기로 알림을 수신하고 있습니다. 알림을 해제하려면 아래 버튼을 눌러주세요.
				</p>
				<Button
					disabled={hold}
					onClick={() => {
						setHold(true)
						getFCMToken()
							.then(async (token) => {
								await Fetch('/users/notification', {
									method: 'DELETE',
									body: JSON.stringify({
										token,
										targetId: id,
									}),
								})
								setHold(false)
								setState(3)
							})
							.catch(() => {
								setState(4)
							})
					}}
				>
					<>
						<i className='far fa-bell-slash mr-1' /> {hold ? '설정 중...' : '알림 해제'}
					</>
				</Button>
			</>
		),
		2: (
			<>
				<p className='whitespace-pre-line text-lg font-normal'>알림이 설정되었습니다.</p>
			</>
		),
		3: (
			<>
				<p className='whitespace-pre-line text-lg font-normal'>알림이 해제되었습니다.</p>
			</>
		),
		4: (
			<>
				<p className='whitespace-pre-line text-lg font-normal'>
					알림을 설정할 수 없습니다. 사용하는 브라우저를 점검해주세요. {'\n'}
					iOS 사용자는 Safari 브라우저에서 한국 디스코드 리스트를 홈 화면에 추가해야 합니다.
				</p>
			</>
		),
		5: (
			<>
				<p className='whitespace-pre-line text-lg font-normal'>
					알림이 허용되지 않았습니다. 브라우저 설정에서 알림을 허용해주세요.
				</p>
			</>
		),
	}
	return (
		components[state] ?? (
			<p className='whitespace-pre-line text-lg font-normal'>
				알림을 설정할 수 없습니다. 사용하는 브라우저를 점검해주세요.
			</p>
		)
	)
}

export default SetNotification
