import { NextApiRequest } from 'next'
import rateLimit from 'express-rate-limit'
import { Colors, EmbedBuilder } from 'discord.js'
import tracer from 'dd-trace'

import { CaptchaVerify, get, put, remove, update } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import {
	AddBotSubmit,
	AddBotSubmitSchema,
	CsrfCaptcha,
	ManageBot,
	ManageBotSchema,
} from '@utils/Yup'
import RequestHandler from '@utils/RequestHandler'
import { User } from '@types'
import {
	checkUserFlag,
	diff,
	inspect,
	makeDiscordCodeblock,
	objectDiff,
	serialize,
} from '@utils/Tools'
import { discordLog, getMainGuild, webhookClients } from '@utils/DiscordBot'
import { KoreanbotsEndPoints } from '@utils/Constants'

const patchLimiter = rateLimit({
	windowMs: 2 * 60 * 1000,
	max: 2,
	handler: (_req, res) => ResponseWrapper(res, { code: 429 }),
	keyGenerator: (req) => req.headers['x-forwarded-for'] as string,
	skip: (_req, res) => {
		res.removeHeader('X-RateLimit-Global')
		return false
	},
})
const Bots = RequestHandler()
	.get(async (req: GetApiRequest, res) => {
		const bot = await get.bot.load(req.query.id)
		if (!bot) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
		else {
			return ResponseWrapper(res, { code: 200, data: bot })
		}
	})
	.post(async (req: PostApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if (!csrfValidated) return

		const validated = await AddBotSubmitSchema.validate(req.body, { abortEarly: false })
			.then((el) => el)
			.catch((e) => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})

		if (!validated) return
		if (validated.id !== req.query.id)
			return ResponseWrapper(res, { code: 400, errors: ['요청 주소와 Body의 정보가 다릅니다.'] })
		const captcha = await CaptchaVerify(validated._captcha)
		if (!captcha) return ResponseWrapper(res, { code: 400, message: '캡챠 검증에 실패하였습니다.' })
		const result = await put.submitBot(user, validated)
		if (result === 1)
			return ResponseWrapper(res, {
				code: 403,
				message: '이미 대기중인 봇이 있습니다.',
				errors: [
					'한 번에 최대 2개의 봇까지만 신청하실 수 있습니다.\n다른 봇들의 심사가 완료된 뒤에 신청해주세요.',
				],
			})
		else if (result === 2)
			return ResponseWrapper(res, {
				code: 406,
				message: '해당 봇은 이미 심사중이거나 이미 등록되어있습니다.',
				errors: [
					'해당 아이디의 봇은 이미 심사중이거나 등록되어있습니다. 본인 소유의 봇이고 신청하신 적이 없으시다면 문의해주세요.',
				],
			})
		else if (result === 3)
			return ResponseWrapper(res, {
				code: 404,
				message: '올바르지 않은 봇 아이디입니다.',
				errors: ['해당 아이디의 봇은 존재하지 않습니다. 다시 확인해주세요.'],
			})
		else if (result === 4)
			return ResponseWrapper(res, {
				code: 403,
				message: '디스코드 서버에 참가해주세요.',
				errors: ['봇 신청하시기 위해서는 공식 디스코드 서버에 참가해주셔야합니다.'],
			})
		else if (result === 5)
			return ResponseWrapper(res, {
				code: 403,
				message: '더 이상 해당 봇에 대한 심사 요청을 하실 수 없습니다.',
				errors: [
					'해당 봇은 심사에서 3회 이상 거부되었습니다. 더 이상의 심사를 요청하실 수 없습니다.',
					'이의 제기를 원하시는 경우 디스코드 서버를 통해 문의해주세요.',
				],
			})
		get.botSubmits.clear(user)

		await discordLog(
			'BOT/SUBMIT',
			user,
			new EmbedBuilder().setDescription(
				`[${result.id}/${result.date}](${KoreanbotsEndPoints.URL.submittedBot(
					result.id,
					result.date
				)})`
			),
			{
				content: inspect(serialize(result)),
				format: 'js',
			}
		)
		const userinfo = await get.user.load(user)
		await webhookClients.internal.reviewLog.send({
			embeds: [
				new EmbedBuilder()
					.setAuthor({
						name:
							userinfo.tag === '0'
								? `${userinfo.globalName} (@${userinfo.username})`
								: `${userinfo.username}#${userinfo.tag}`,
						iconURL:
							KoreanbotsEndPoints.URL.root +
							KoreanbotsEndPoints.CDN.avatar(userinfo.id, { format: 'png', size: 256 }),
						url: KoreanbotsEndPoints.URL.user(userinfo.id),
					})
					.setTitle('대기 중')
					.setColor(Colors.Grey)
					.setDescription(
						`[${result.id}/${result.date}](${KoreanbotsEndPoints.URL.submittedBot(
							result.id,
							result.date
						)})`
					)
					.setTimestamp(),
			],
		})
		tracer.trace('botSubmits.submitted', (span) => {
			span.setTag('id', result.id)
			span.setTag('date', result.date)
			span.setTag('user', userinfo.id)
		})
		return ResponseWrapper(res, { code: 200, data: result })
	})
	.delete(async (req: DeleteApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const bot = await get.bot.load(req.query.id)
		if (!bot) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
		if ((bot.owners as User[])[0].id !== user) return ResponseWrapper(res, { code: 403 })
		const userInfo = await get.user.load(user)
		if (
			['reported', 'blocked', 'archived'].includes(bot.state) &&
			!checkUserFlag(userInfo?.flags, 'staff')
		)
			return ResponseWrapper(res, {
				code: 403,
				message: '해당 봇은 수정할 수 없습니다.',
				errors: ['오류라고 생각되면 문의해주세요.'],
			})
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if (!csrfValidated) return
		const captcha = await CaptchaVerify(req.body._captcha)
		if (!captcha) return ResponseWrapper(res, { code: 400, message: '캡챠 검증에 실패하였습니다.' })
		if (req.body.name !== bot.name)
			return ResponseWrapper(res, { code: 400, message: '봇 이름을 입력해주세요.' })
		await remove.bot(bot.id)
		await getMainGuild().members.cache.get(bot.id)?.kick('봇 삭제됨.')
		get.user.clear(user)
		await discordLog(
			'BOT/DELETE',
			user,
			new EmbedBuilder().setDescription(
				`${bot.name} - <@${bot.id}> ([${bot.id}](${KoreanbotsEndPoints.URL.bot(bot.id)}))`
			),
			{
				content: inspect(bot),
				format: 'js',
			}
		)
		return ResponseWrapper(res, { code: 200, message: '성공적으로 삭제했습니다.' })
	})
	.patch(patchLimiter)
	.patch(async (req: PatchApiRequest, res) => {
		const bot = await get.bot.load(req.query.id)
		if (!bot) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const userInfo = await get.user.load(user)
		if (
			['reported', 'blocked', 'archived'].includes(bot.state) &&
			!checkUserFlag(userInfo?.flags, 'staff')
		)
			return ResponseWrapper(res, {
				code: 403,
				message: '해당 봇은 수정할 수 없습니다.',
				errors: ['오류라고 생각되면 문의해주세요.'],
			})
		if (
			!(bot.owners as User[]).find((el) => el.id === user) &&
			!checkUserFlag(userInfo?.flags, 'staff')
		)
			return ResponseWrapper(res, { code: 403 })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if (!csrfValidated) return

		const validated = await ManageBotSchema.validate(req.body, { abortEarly: false })
			.then((el) => el)
			.catch((e) => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})

		if (!validated) return

		const result = await update.bot(req.query.id, validated)
		if (result === 0) return ResponseWrapper(res, { code: 400 })
		else {
			get.bot.clear(req.query.id)
			const embed = new EmbedBuilder().setDescription(
				`${bot.name} - <@${bot.id}> ([${bot.id}](${KoreanbotsEndPoints.URL.bot(bot.id)}))`
			)
			const diffData = objectDiff(
				{
					prefix: bot.prefix,
					library: bot.lib,
					web: bot.web,
					git: bot.git,
					url: bot.url,
					discord: bot.discord,
					intro: bot.intro,
					category: JSON.stringify(bot.category),
				},
				{
					prefix: validated.prefix,
					library: validated.library,
					web: validated.website,
					git: validated.git,
					url: validated.url,
					discord: validated.discord,
					intro: validated.intro,
					category: JSON.stringify(validated.category),
				}
			)
			diffData.forEach((d) => {
				embed.addFields({
					name: d[0],
					value: makeDiscordCodeblock(diff(d[1][0] || '', d[1][1] || ''), 'diff'),
				})
			})
			await discordLog('BOT/EDIT', user, embed, {
				content: `--- 설명\n${diff(bot.desc, validated.desc, true)}`,
				format: 'diff',
			})
			return ResponseWrapper(res, { code: 200 })
		}
	})

interface GetApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

interface PostApiRequest extends GetApiRequest {
	body: AddBotSubmit | null
}

interface PatchApiRequest extends GetApiRequest {
	body: ManageBot | null
}

interface DeleteApiRequest extends GetApiRequest {
	body: (CsrfCaptcha & { name: string }) | null
}

export default Bots
