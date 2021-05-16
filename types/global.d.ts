import * as Yup from 'yup'

declare global {
	interface Window {
		ga(a: string, b: string, c: string): void
		hljs: {
			initHighlighting(): void
			highlightBlock(e: Element): void
		}
	}
	interface Navigator {
		standalone?: boolean
	}
}
declare module 'yup' {
	class ArraySchema extends Yup.array {
		unique(format?: string): this
	}
}
