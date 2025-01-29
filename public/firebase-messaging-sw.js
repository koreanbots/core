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

messaging.onBackgroundMessage(function (payload) {
	console.log('[firebase-messaging-sw.js] Received background message ', payload)
	// Customize notification here
	const notificationTitle = payload.notification.title
	const notificationOptions = {
		body: payload.notification.body,
		icon: payload.notification.image,
	}
	notificationOptions.data = payload.data

	self.addEventListener('notificationclick', function (event) {
		event.notification.close()
		clients.openWindow(event.notification.data.url)
	})

	self.registration.showNotification(notificationTitle, notificationOptions)
})
