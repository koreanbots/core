import csrf from 'csurf'
import { CsrfRequestMessage } from '@types'


const csrfProtection = (csrf({ cookie: true }) as unknown as CsrfRequestMessage)

export default csrfProtection