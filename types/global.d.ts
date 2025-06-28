/* eslint-disable no-var */
import * as Yup from 'yup'
import { Client } from 'discord.js'
import NotificationManager from '@utils/NotificationManager'
import { CacheManager } from '@utils/Query'

declare global {
	interface Window {
		ga(a: string, b: string, c: string): void
		hljs: {
			initHighlighting(): void
			highlightBlock(e: Element): void
		}
	}
	var kodl: Client
	var serverlist: Client
	var notification: NotificationManager
	var get: CacheManager
	interface Navigator {
		standalone?: boolean
	}
}
declare module 'yup' {
	class ArraySchema extends Yup.array {
		unique(format?: string): this
	}
}

declare module 'difflib' {
	export function unifiedDiff(before: string, after: string): string[]
}

export {}
