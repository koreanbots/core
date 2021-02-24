/* eslint-disable jsx-a11y/no-autofocus */
import { useRef, useState } from 'react'
import { Field } from 'formik'
import { Picker } from 'emoji-mart'

import { KoreanbotsEmoji } from '@utils/Constants'
import useOutsideClick from '@utils/useOutsideClick'

import 'emoji-mart/css/emoji-mart.css'



const TextArea = ({ name, placeholder, theme='auto', setValue, value }:TextAreaProps):JSX.Element => {
	const ref = useRef()
	const [ emojiPickerHidden, setEmojiPickerHidden ] = useState(true)
	useOutsideClick(ref, () => {
		setEmojiPickerHidden(true)
	})
	
	return <div className='border border-grey-light dark:border-transparent h-96 text-black dark:bg-very-black dark:text-white rounded px-4 py-3 inline-block relative w-full'>
		<Field as='textarea' name={name} className='dark:border-transparent text-black dark:bg-very-black dark:text-white w-full relative h-full resize-none outline-none' placeholder={placeholder} />
		<div ref={ref}>
			<div className='absolute bottom-12 -right-3 sm:right-8 z-30'>
				{
					!emojiPickerHidden && <Picker title='선택해주세요' emoji='sunglasses' set='twitter' enableFrequentEmojiSort	theme={theme} showSkinTones={false} onSelect={(e) => {
						setEmojiPickerHidden(true)
						setValue(value + ' ' + ((e as { native: string }).native || e.colons))
					}} i18n={{
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
							custom: '커스텀'
						}
					}} custom={KoreanbotsEmoji}/>
				}
			</div>
			<div className='absolute bottom-3 right-8'>
				<div className='emoji-selector-button outline-none' onClick={() => setEmojiPickerHidden(false)} onKeyPress={() => setEmojiPickerHidden(false)} role='button' tabIndex={0} />
			</div>
		</div>
	</div>
}

interface TextAreaProps {
  name: string
  placeholder?: string
  theme?: 'auto' | 'dark' | 'light'
  value: string
  setValue(value: string): void
}

export default TextArea

