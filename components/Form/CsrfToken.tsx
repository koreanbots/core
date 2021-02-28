import { Field } from 'formik'

const CsrfToken = ({ token }: CsrfTokenProps): JSX.Element => {
	return <Field name='_csrf' hidden value={token} readOnly />
}

interface CsrfTokenProps {
	token: string
}

export default CsrfToken
