import { NextApiRequest } from 'next'
import rateLimit from 'express-rate-limit'
import { EmbedBuilder } from 'discord.js'

import { CaptchaVerify, get, put, remove, update } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import { AddServerSubmitSchema, AddServerSubmit, CsrfCaptcha, ManageServerSchema, ManageServer } from '@utils/Yup'
import RequestHandler from '@utils/RequestHandler'
import { checkUserFlag, diff, inspect, makeDiscordCodeblock, objectDiff, serialize } from '@utils/Tools'
import { DiscordBot, discordLog } from '@utils/DiscordBot'
import { KoreanbotsEndPoints } from '@utils/Constants'
import { verifyWebhook } from '@utils/Webhook'

const patchLimiter = rateLimit({
	windowMs: 2 * 60 * 1000,
	max: 2,
	handler: (_req, res) => ResponseWrapper(res, { code: 429 }),
	keyGenerator: (req) => req.headers['x-forwarded-for'] as string,
	skip: (_req, res) => {
		res.removeHeader('X-RateLimit-Global')
		return false
	}
})
const Servers = RequestHandler()
	.get(async (req: GetApiRequest, res) => {
		const server = await get.server.load(req.query.id)
		if (!server) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 서버 입니다.' })
		else return ResponseWrapper(res, { code: 200, data: server })
	})
	.post(async (req: PostApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if (!csrfValidated) return

		const validated = await AddServerSubmitSchema.validate(req.body, { abortEarly: false })
			.then(el => el)
			.catch(e => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})

		if (!validated) return
		const captcha = await CaptchaVerify(validated._captcha)
		if(!captcha) return ResponseWrapper(res, { code: 400, message: '캡챠 검증에 실패하였습니다.' })
		const result = await put.submitServer(user, req.query.id, validated)
		if (result === 1)
			return ResponseWrapper(res, {
				code: 400,
				message: '이미 등록된 서버 입니다.'
			})
		else if (result === 2)
			return ResponseWrapper(res, {
				code: 406,
				message: '봇이 초대되지 않았습니다.',
				errors: [
					'서버에 봇이 초대되지 않았습니다.',
					'이미 봇을 초대하셨다면, 잠시 후 다시 시도해주세요.'
				],
			})
		else if (result === 3)
			return ResponseWrapper(res, {
				code: 403,
				message: '서버의 관리자가 아닙니다.',
				errors: [
					'해당 서버를 등록할 권한이 없습니다.',
					'서버에서 관리자 권한이 있으신지 확인해주세요.'
				],
			})
		else if (result === 4)
			return ResponseWrapper(res, {
				code: 400,
				message: '올바르지 않은 초대 코드 입니다.',
				errors: [
					'올바른 초대코드를 입력하셨는지 확인해주세요'
				],
			})
		get.user.clear(user)
		await discordLog('SERVER/SUBMIT', user, new EmbedBuilder().setDescription(`[${req.query.id}](${KoreanbotsEndPoints.URL.server(req.query.id)})`), {
			content: inspect(serialize(validated)),
			format: 'js'
		})

		return ResponseWrapper(res, { code: 200, data: result })
	})
	.delete(async (req: DeleteApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const server = await get.server.load(req.query.id)
		if(!server) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 서버 입니다.' })
		const data = await get.serverData(req.query.id)
		if(!data || server.state === 'unreachable') return ResponseWrapper(res, { code: 400, message: '해당 서버의 정보를 불러올 수 없습니다.', errors: ['봇이 추방되었거나, 오프라인이 아닌지 확인하시고 다시 시도해주세요.'] })
		if(![data.owner, ...data.admins].includes(user)) return ResponseWrapper(res, { code: 403 })
		const userInfo = await get.user.load(user)
		if(['reported', 'blocked'].includes(server.state) && !checkUserFlag(userInfo?.flags, 'staff')) return ResponseWrapper(res, { code: 403, message: '해당 서버는 수정할 수 없습니다.', errors: ['오류라고 생각되면 문의해주세요.'] })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if (!csrfValidated) return
		const captcha = await CaptchaVerify(req.body._captcha)
		if(!captcha) return ResponseWrapper(res, { code: 400, message: '캡챠 검증에 실패하였습니다.' })
		if(req.body.name !== server.name) return ResponseWrapper(res, { code: 400, message: '봇 이름을 입력해주세요.' })
		await remove.server(server.id)
		get.user.clear(user)
		await discordLog('SERVER/DELETE', user, (new EmbedBuilder().setDescription(`${server.name} - [${server.id}](${KoreanbotsEndPoints.URL.bot(server.id)}))`)),
			{
				content: inspect(server),
				format: 'js'
			}
		)
		return ResponseWrapper(res, { code: 200, message: '성공적으로 삭제했습니다.' })
	})
	.patch(patchLimiter).patch(async (req: PatchApiRequest, res) => {
		const server = await get.server.load(req.query.id)
		if(!server) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 서버입니다.' })
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const userInfo = await get.user.load(user)
		const data = await get.serverData(req.query.id)
		if(!data || server.state === 'unreachable') return ResponseWrapper(res, { code: 400, message: '해당 서버의 정보를 불러올 수 없습니다.', errors: ['봇이 추방되었거나, 오프라인이 아닌지 확인하시고 다시 시도해주세요.'] })
		if(![data.owner, ...data.admins].includes(user) && !checkUserFlag(userInfo?.flags, 'staff')) return ResponseWrapper(res, { code: 403 })
		if(['reported', 'blocked'].includes(server.state) && !checkUserFlag(userInfo?.flags, 'staff')) return ResponseWrapper(res, { code: 403, message: '해당 서버는 수정할 수 없습니다.', errors: ['오류라고 생각되면 문의해주세요.'] })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if (!csrfValidated) return

		const validated = await ManageServerSchema.validate(req.body, { abortEarly: false })
			.then(el => el)
			.catch(e => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})

		if (!validated) return
		const invite = await DiscordBot.fetchInvite(validated.invite).catch(() => null)
		if(invite?.guild.id !== server.id) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 초대코드입니다.', errors: ['입력하신 초대코드가 올바르지 않습니다. 올바른 초대코드를 입력했는지 다시 한 번 확인해주세요.'] })
		
		const key = await verifyWebhook(validated.webhook)
		if(key === false) {
			return ResponseWrapper(res, { code: 400, message: '웹후크 주소를 검증할 수 없습니다.', errors: ['웹후크 주소가 올바른지 확인해주세요.\n웹후크 주소 검증에 대한 자세한 내용은 API 문서를 참고해주세요.'] })
		}
		const result = await update.server(req.query.id, validated, key)
		if(result === 0) return ResponseWrapper(res, { code: 400 })
		else {
			get.server.clear(req.query.id)
			const embed = new EmbedBuilder().setDescription(`${server.name} - ([${server.id}](${KoreanbotsEndPoints.URL.server(server.id)}))`)
			const diffData = objectDiff(
				{ intro: server.intro, invite: server.invite, category: JSON.stringify(server.category) },
				{ intro: validated.intro, invite: validated.invite, category: JSON.stringify(validated.category) },
			)
			diffData.forEach(d => {
				embed.addFields({name: d[0], value: makeDiscordCodeblock(diff(d[1][0] || '', d[1][1] || ''), 'diff')
				})
			})
			await discordLog('SERVER/EDIT', user, embed,
				{
					content: `--- 설명\n${diff(server.desc, validated.desc, true)}`,
					format: 'diff'
				}
			)
			return ResponseWrapper(res, { code: 200 })
		}
		
	})

interface GetApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

interface PostApiRequest extends GetApiRequest {
	body: AddServerSubmit | null
}

interface PatchApiRequest extends GetApiRequest {
	body: ManageServer | null
}

interface DeleteApiRequest extends GetApiRequest {
		body: CsrfCaptcha & { name: string } | null
}

export default Servers
