import Tooltip from '@components/Tooltip'

const Label: React.FC<LabelProps> = ({
	For,
	children,
	label,
	labelDesc,
	error = null,
	grid = true,
	short = false,
	required = false,
	warning = false,
	warningText
}) => {
	return <label
		className={grid ? 'grid grid-cols-1 xl:grid-cols-4 gap-2 my-4' : 'inline-flex items-center'}
		htmlFor={For}
	>
		{label && (
			<div className='col-span-1 text-sm'>
				<h3 className='text-koreanbots-blue text-lg font-bold'>
					{label}
					{required && (
						<span className='align-text-top text-red-500 text-base font-semibold'> *</span>
					)}
					{warning && (
						<Tooltip direction='left' text={warningText}>
							<span className='text-red-500 text-base font-semibold pl-1' role='img' aria-label='warning'>⚠️</span>
						</Tooltip>
					)}
				</h3>
				{labelDesc}
			</div>
		)}
		<div className={short ? 'col-span-1' : 'col-span-3'}>
			{children}
			<div className='mt-1 text-red-500 text-xs font-light'>{error}</div>
		</div>
	</label>
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
