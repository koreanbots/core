const Label: React.FC<LabelProps> = ({
	For,
	children,
	label,
	labelDesc,
	error = null,
	grid = true,
	short = false,
	required = false,
}) => {
	return (
		<label
			className={grid ? 'my-4 grid grid-cols-1 gap-2 xl:grid-cols-4' : 'inline-flex items-center'}
			htmlFor={For}
		>
			{label && (
				<div className='col-span-1 text-sm'>
					<h3 className='text-lg font-bold text-koreanbots-blue'>
						{label}
						{required && (
							<span className='align-text-top text-base font-semibold text-red-500'> *</span>
						)}
					</h3>
					{labelDesc}
				</div>
			)}
			<div className={short ? 'col-span-1' : 'col-span-3'}>
				{children}
				<div className='mt-1 text-xs font-light text-red-500'>{error}</div>
			</div>
		</label>
	)
}

interface LabelProps {
	For: string
	children: JSX.Element | JSX.Element[]
	label?: string
	labelDesc?: string | JSX.Element
	error?: string | null
	grid?: boolean
	short?: boolean
	required?: boolean
	warning?: boolean
	warningText?: string | null
}

export default Label
