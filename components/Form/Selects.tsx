import React, { MouseEventHandler } from 'react'
import ReactSelect, {
	components,
	MultiValueProps,
	MultiValueRemoveProps,
} from 'react-select'
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import {
	arrayMove,
	horizontalListSortingStrategy,
	SortableContext,
	useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const MultiValue = (props: MultiValueProps<Option>) => {
	const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault()
		e.stopPropagation()
	}
	const innerProps = { ...props.innerProps, onMouseDown }
	const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.data.value })
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div style={style} ref={setNodeRef} {...attributes} {...listeners}>
			<components.MultiValue {...props} innerProps={innerProps} />
		</div>
	)
}

const MultiValueRemove = (props: MultiValueRemoveProps<Option>) => {
	return (
		<components.MultiValueRemove
			{...props}
			innerProps={{
				onPointerDown: (e) => e.stopPropagation(),
				...props.innerProps,
			}}
		/>
	)
}

const Select: React.FC<SelectProps> = ({ placeholder, options, values, setValues, handleChange, handleTouch }) => {
	const onSortEnd = (event: DragEndEvent) => {
		const { active, over } = event
		const newValue = arrayMove(values, values.findIndex(i => i === active.id), values.findIndex(i => i === over.id))
		setValues(newValue)
	}
	return <DndContext modifiers={[restrictToParentElement]} onDragEnd={onSortEnd} collisionDetection={closestCenter}>
		<SortableContext
			items={values}
			strategy={horizontalListSortingStrategy}>
			<ReactSelect
				styles={{
					control: (provided) => {
						return { ...provided, border: 'none' }
					},
					option: (provided) => {
						return { ...provided, cursor: 'pointer', ':hover': {
							opacity: '0.7'
						} }
					}
				}} 
				isMulti
				className='border border-grey-light dark:border-transparent rounded' 
				classNamePrefix='outline-none text-black dark:bg-very-black dark:text-white cursor-pointer ' 
				placeholder={placeholder || '선택해주세요.'} 
				options={options} 
				onChange={handleChange} 
				onBlur={handleTouch}
				noOptionsMessage={() => '검색 결과가 없습니다.'}
				value={values.map(el => ({ label: el, value: el}))}
				components={{
					MultiValue,
					MultiValueRemove,
				}}
				closeMenuOnSelect={false}
			/>
		</SortableContext>
	</DndContext> 
}

interface SelectProps {
  placeholder?: string
  options: Option[]
	values: string[]
	setValues: (value: string[]) => void
	handleChange: (value: Option[]) => void
  handleTouch: () => void
}

interface Option {
  value: string
  label: string
}

export default Select