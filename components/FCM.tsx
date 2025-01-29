import Fetch from '@utils/Fetch'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken as getFirebaseToken } from 'firebase/messaging'
import { useState } from 'react'
import Button from './Button'

function SetNotification({ id }: { id: string }) {
	const [state, setState] = useState(0)

	const getToken = async () => {
		const p = await Notification.requestPermission()
		if (p !== 'granted') {
			return 'PERMISSION_DENIED'
		}

		const app = initializeApp({
			apiKey: 'AIzaSyDWnwXCBaP1C627gfIBQxyZbmNnAU_b_1Q',
			authDomain: 'koreanlist-e95d9.firebaseapp.com',
			projectId: 'koreanlist-e95d9',
			storageBucket: 'koreanlist-e95d9.firebasestorage.app',
			messagingSenderId: '716438516411',
			appId: '1:716438516411:web:cddd6c7cc3b0571fa4af9e',
		})

		const messaging = getMessaging(app)
		const token = await getFirebaseToken(messaging, {
			vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
		})

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
			setState(3)
		}
	}
	const components = {
		0: (
			<>
				<p className='whitespace-pre-line text-lg font-normal'>
					12시간 후에 이 기기로 알림을 받으려면 아래 버튼을 눌러주세요.
				</p>
				<Button onClick={() => getToken()}>
					<>
						<i className='far fa-bell' /> 투표 알림 설정
					</>
				</Button>
			</>
		),
		2: (
			<>
				<p className='whitespace-pre-line text-lg font-normal'>알림이 설정되었습니다.</p>
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
