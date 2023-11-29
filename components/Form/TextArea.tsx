/* eslint-disable jsx-a11y/no-autofocus */
import { useRef, useState } from 'react'
import { Field } from 'formik'
import { Picker } from 'emoji-mart'

import { KoreanbotsEmoji } from '@utils/Constants'
import useOutsideClick from '@utils/useOutsideClick'

import 'emoji-mart/css/emoji-mart.css'

const TextArea: React.FC<TextAreaProps> = ({
	name,
	placeholder,
	theme = 'auto',
	max,
	setValue,
	value,
}) => {
	const ref = useRef()
	const [emojiPickerHidden, setEmojiPickerHidden] = useState(true)
	useOutsideClick(ref, () => {
		setEmojiPickerHidden(true)
	})

	return (
		<div className='border-grey-light relative inline-block h-96 w-full rounded border px-4 py-3 text-black dark:border-transparent dark:bg-very-black dark:text-white'>
			<Field
				as='textarea'
				name={name}
				className='relative h-full w-full resize-none text-black outline-none dark:border-transparent dark:bg-very-black dark:text-white'
				placeholder={placeholder}
			/>
			<div ref={ref}>
				<div className='absolute bottom-12 left-10 z-30'>
					{!emojiPickerHidden && (
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						<Picker
							title='선택해주세요'
							emoji='sunglasses'
							set='twitter'
							enableFrequentEmojiSort
							theme={theme}
							showSkinTones={false}
							onSelect={(e) => {
								setEmojiPickerHidden(true)
								setValue(value + ' ' + ((e as { native: string }).native || e.colons))
							}}
							i18n={{
								search: '검색',
								notfound: '검색 결과가 없습니다.',
								categories: {
									search: '검색 결과',
									recent: '최근 사용',
									people: '사람',
									nature: '자연',
									foods: '음식',
									activity: '활동',
									places: '장소',
									objects: '사물',
									symbols: '기호',
									flags: '국기',
									custom: '커스텀',
								},
							}}
							custom={KoreanbotsEmoji}
						/>
					)}
				</div>
				<div className='absolute bottom-2 left-4 hidden sm:block'>
					<div
						className='emoji-selector-button outline-none'
						onClick={() => setEmojiPickerHidden(false)}
						onKeyPress={() => setEmojiPickerHidden(false)}
						role='button'
						tabIndex={0}
					/>
				</div>
				{max && (
					<span
						className={`absolute bottom-2 right-4 ${max < value.length ? ' text-red-400' : ''}`}
					>
						{max - value.length}
					</span>
				)}
			</div>
		</div>
	)
}

interface TextAreaProps {
	name: string
	placeholder?: string
	theme?: 'auto' | 'dark' | 'light'
	max?: number
	value: string
	setValue(value: string): void
}

export default TextArea
