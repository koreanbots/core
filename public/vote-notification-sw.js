/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

firebase.initializeApp({
	apiKey: 'AIzaSyDWnwXCBaP1C627gfIBQxyZbmNnAU_b_1Q',
	authDomain: 'koreanlist-e95d9.firebaseapp.com',
	projectId: 'koreanlist-e95d9',
	storageBucket: 'koreanlist-e95d9.firebasestorage.app',
	messagingSenderId: '716438516411',
	appId: '1:716438516411:web:cddd6c7cc3b0571fa4af9e',
})

const messaging = firebase.messaging()

/*
{
	type: 'vote-available',
	name: target.name,
	imageUrl: image ?? undefined,
	url: `/${isBot ? 'bots' : 'servers'}/${noti.target_id}`,
}
*/

messaging.onBackgroundMessage(function (payload) {
	if (payload.data.type !== 'vote-available') return
	const notificationTitle = '투표 알림'
	const notificationOptions = {
		body: `${payload.data.name}의 투표가 가능합니다.`,
		icon: payload.data.imageUrl,
	}
	notificationOptions.data = payload.data

	self.addEventListener('notificationclick', function (event) {
		event.notification.close()
		clients.openWindow(event.notification.data.url)
	})

	self.registration.showNotification(notificationTitle, notificationOptions)
})
