import * as Yup from 'yup'
declare module 'yup' {
	class ArraySchema extends Yup.array {
		unique(format?: string): this
	}
}
