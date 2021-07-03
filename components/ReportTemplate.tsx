import { FC, useState } from 'react'
import dynamic from 'next/dynamic'
import { FormikErrors, FormikTouched } from 'formik'

const Button = dynamic(() => import('@components/Button'))
const TextArea = dynamic(() => import('@components/Form/TextArea'))

export const Check: FC<{ checked: boolean, text: string }> = ({ checked, text }) => <>
	{checked && <i className='text-green-400 fas fa-check-circle mr-1' />}
	{text}
</>

export const SubmitButton: FC = () => <div className='text-right'>
	<Button type='submit'>제출</Button>
</div>

export const TextField: FC<ReportTemplateProps> = ({ values, errors, touched, setFieldValue }) => <>
	<TextArea name='description' placeholder='최대한 자세하게 설명해주세요!' value={values.description} setValue={(value) => setFieldValue('description', value)} />
	<div className='mt-1 text-red-500 text-xs font-light'>{errors.description && touched.description ? errors.description : null}</div>
	<SubmitButton />
</>

export const DMCA: FC<ReportTemplateProps> = ({ values, errors, touched, setFieldValue }) => {
	const [ isOwner, setOwner ] = useState(null)
	const [ contacted, setContacted ] = useState(null)
	return <div>
		<h3 className='font-bold my-2'>권리자와는 어떤 관계인가요?</h3>
		<Button onClick={() => setOwner(true)}>
			<Check checked={isOwner} text='권리자 본인 혹은 대리인입니다.' />
		</Button>
		<Button onClick={() => setOwner(false)}>
			<Check checked={isOwner === false} text='권리자가 아닙니다.' />
		</Button>
		{
			isOwner === true ? <>
				<h3 className='font-bold my-2'>권리 침해자에게 연락하여 라이선스 위반사항을 고지하셨나요?</h3>
				<Button onClick={() => setContacted(true)}>
					<Check checked={contacted} text='최대한 연락을 시도하였지만 개선되지 않았습니다.' />
				</Button>
				<Button onClick={() => setContacted(false)}>
					<Check checked={contacted === false} text='아니요, 아직 연락하지 않았습니다.' />
				</Button>
				{
					contacted ? <div>
						<h3 className='font-bold mt-2'>설명</h3>
						<p className='text-gray-400 text-sm mb-1'>반드시 아래 항목들을 포함해야합니다.</p>
						<ul className='text-gray-400 text-sm mb-1 list-disc list-inside'>
							<li>권리자 본인임을 증명 (단체 소속인 경우 어떤 자격으로 단체를 대표하여 신고하는지 설명)</li>
							<li>본인의 권리를 입증 (원본 컨텐츠의 주소, 라이선스 등을 포함)</li>
						</ul>
						<p className='text-gray-400 text-sm mb-1'>컨텐츠를 추가로 첨부해야하는 경우 dmca@koreanbots.dev의 이메일로 첨부해주시고, 해당 이메일로 첨부했음을 아래 설명에 기재해주세요.</p>
						<TextField values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
					</div>
						: contacted === false ? <>
							<h2 className='font-bold mt-4 text-xl'>먼저 권리 침해자에게 연락을 시도해주세요.</h2>
							<p>본인의 권리를 침해하신 분께 먼저 연락을 시도하셔서 위반사항을 고지하시고, 연락이 불가하다면 신고 기능을 이용해주세요.</p>
						</> : ''
				}
			</>
				: isOwner === false ? <>
					<h2 className='font-bold mt-4 text-xl'>아쉽지만, 권리자 본인 혹은 대리인만 신고하실 수 있습니다.</h2>
					<p>권리자 분께 말씀드려, 권리자 본인이 직접 신고하시도록 해주세요!</p>
				</> : ''
		}
	</div>
}

interface ReportValues {
  category: string | null
  description: string
  _csrf: string
}
interface ReportTemplateProps {
  values?: ReportValues
  errors?: FormikErrors<ReportValues>
  touched?: FormikTouched<ReportValues>
  setFieldValue?(field: string, value: unknown): void
}