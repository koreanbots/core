import * as Yup from 'yup'

declare global {
	interface Window {
		hljs: {
			initHighlighting(): void
			highlightBlock(e: Element): void
		}
	}
}
declare module 'yup' {
	class ArraySchema extends Yup.array {
		unique(format?: string): this
	}
}
