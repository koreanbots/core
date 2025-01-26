import * as Yup from 'yup'
import { Client } from 'discord.js'

declare global {
	interface Window {
		ga(a: string, b: string, c: string): void
		hljs: {
			initHighlighting(): void
			highlightBlock(e: Element): void
		}
	}
	// eslint-disable-next-line no-var
	var kodl: Client
	// eslint-disable-next-line no-var
	var serverlist: Client
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
