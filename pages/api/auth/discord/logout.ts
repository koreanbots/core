import { serialize } from 'cookie'
import RequestHandler from '@utils/RequestHandler'

const Logout = RequestHandler().get(async (req, res) => {
	res.setHeader('Cache-control', 'no-cache')
	res.setHeader(
		'set-cookie',
		serialize('token', '', {
			maxAge: -1,
			path: '/',
		})
	)
	res.redirect(301, '/')
})
export default Logout
