import { NextApiRequest, NextApiResponse } from 'next'
import { generateOauthURL } from '@utils/Tools'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get, update } from '@utils/Query'
import { checkToken } from '@utils/Csrf'

const Github = RequestHandler().get(async (_req: NextApiRequest, res: NextApiResponse) => {
	res.redirect(
		301,
		generateOauthURL('github', process.env.GITHUB_CLIENT_ID)
	)
})
	.delete(async (req: DeleteApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if(!csrfValidated) return
		await update.Github(user, null)
		get.user.clear(user)
		return ResponseWrapper(res, { code: 200 })
	})

interface DeleteApiRequest extends NextApiRequest {
	body: {
		_csrf: string
	}
}

export default Github
