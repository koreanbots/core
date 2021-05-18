import { Field } from 'formik'

const CsrfToken: React.FC<CsrfTokenProps> = ({ token }) => {
	return <Field name='_csrf' hidden value={token} readOnly />
}

interface CsrfTokenProps {
	token: string
}

export default CsrfToken
