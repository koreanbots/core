import { Bot, ImageOptions, KoreanbotsImageOptions, Server } from '@types'
import { KeyMap } from 'react-hotkeys'
import { formatNumber, makeImageURL } from './Tools'

// Website META DATA
export const TITLE = '한국 디스코드 리스트'
export const DESCRIPTION = '국내 디스코드의 모든 것을 한 곳에서 확인하세요!'
export const THEME_COLOR = '#3366FF'
export const DSKR_BOT_ID = '784618064167698472'

export const VOTE_COOLDOWN = 12 * 60 * 60 * 1000
export const BUG_REPORTERS = ['260303569591205888']
export const BUG_REPORT_GROUPS = ['경북소프트웨어고등학교 해킹방어 그룹']
export const Status = {
	online: {
		text: '온라인',
		color: 'emerald-400',
	},
	idle: {
		text: '자리 비움',
		color: 'amber-300',
	},
	dnd: {
		text: '다른 용무중',
		color: 'red-500',
	},
	offline: {
		text: '오프라인',
		color: 'gray-500',
	},
	streaming: {
		text: '방송중',
		color: 'violet-500',
	},
	null: {
		text: '알 수 없음',
		color: 'gray-500',
	},
	'???': {
		text: '알 수 없음',
		color: 'gray-500',
	},
}

export const library = [
	'discord.js',
	'Eris',
	'discord.py',
	'discordcr',
	'Nyxx',
	'Discord.Net',
	'DSharpPlus',
	'Nostrum',
	'coxir',
	'DiscordGo',
	'Discord4J',
	'Javacord',
	'JDA',
	'Discordia',
	'RestCord',
	'Yasmin',
	'disco',
	'discordrb',
	'serenity',
	'SwiftDiscord',
	'Sword',
	'기타',
	'비공개',
]

export const botCategories = [
	// 상위 카테고리
	'관리',
	'뮤직',
	'전적',
	'게임',
	'도박',
	'로깅',
	'빗금 명령어',
	'웹 대시보드',
	'밈',
	'레벨링',
	'유틸리티',
	'대화',
	'NSFW',
	'검색',
	// 검색
	'학교',
	'코로나19',
	// 유틸리티
	'번역',
	// 전적
	'오버워치',
	'리그 오브 레전드',
	'배틀그라운드',
	'마인크래프트',
]

export const botCategoryDescription = {
	관리: '유저 관리, 서버 관리 등 디스코드 서버를 직접적으로 관리할 수 있습니다.',
	뮤직: '디스코드 음성 채널을 통해 음악을 재생할 수 있습니다.',
	전적: '게임 유저 전적이나 게임 정보 등 여러 전적에 대해 다룹니다.',
	게임: '봇에 자체적인 게임 콘텐츠가 있습니다.',
	도박: '봇 내 가상 재화를 이용해 도박을 할 수 있습니다.',
	로깅: '유저의 출입, 메시지 수정 / 삭제 등을 로그로 남길 수 있습니다.',
	'빗금 명령어': '메시지 기반이 아닌 빗금 명령어를 사용합니다.',
	'웹 대시보드': '웹사이트를 통해 봇을 조작할 수 있습니다.',
	밈: '각종 밈을 다루고 있습니다.',
	레벨링: '디스코드 서버 안에서 채팅 등을 통해 레벨을 올릴 수 있는 기능을 제공합니다.',
	유틸리티: '여러 편리한 기능들을 제공합니다.',
	대화: '봇이 학습하거나 인공지능을 통해 대화할 수 있습니다.',
	NSFW: 'NotSafeForWork(후방주의)의 약자로 위험하거나 불쾌감을 포함할 수 있는 콘텐츠를 다룹니다.',
	검색: '봇으로 검색을 수행할 수 있습니다.',
	학교: '급식이나 시간표 정보 등 학교와 관련된 기능을 제공합니다.',
	코로나19: '코로나19와 관련된 기능을 제공합니다.',
	번역: '번역을 할 수 있습니다.',
	오버워치: '게임 "오버워치"에 관련된 기능을 다룹니다.',
	'리그 오브 레전드': '게임 "리그 오브 레전드"에 관련된 기능을 다룹니다.',
	배틀그라운드: '게임 "배틀그라운드"에 관련된 기능을 다룹니다.',
	마인크래프트: '게임 "마인크래프트"에 관련된 기능을 다룹니다.',
}

export const botCategoryIcon = {
	관리: 'fas fa-cogs',
	뮤직: 'fas fa-music',
	전적: 'fas fa-puzzle-piece',
	'웹 대시보드': 'fas fa-sliders-h',
	로깅: 'fas fa-pencil-alt',
	'빗금 명령어': null,
	도박: 'fas fa-money-bill-alt',
	게임: 'fas fa-gamepad',
	밈: 'fas fa-image',
	레벨링: 'fas fa-angle-double-up',
	유틸리티: 'fas fa-tools',
	번역: 'fas fa-language',
	대화: 'fas fa-comments',
	NSFW: 'fas fa-exclamation-triangle',
	검색: 'fas fa-search',
	학교: 'fas fa-school',
	코로나19: 'fas fa-viruses',
	오버워치: 'fas fa-mask',
	'리그 오브 레전드': 'fas fa-chess',
	배틀그라운드: 'fas fa-meteor',
	마인크래프트: 'fas fa-cubes',
}

export const serverCategories = [
	'커뮤니티',
	'IT & 과학',
	'봇',
	'친목',
	'음악',
	'교육',
	'연애',
	// 게임
	'게임',
	'오버워치',
	'리그 오브 레전드',
	'배틀그라운드',
	'마인크래프트',
]

export const serverCategoryIcon = {
	커뮤니티: 'fas fa-comments',
	친목: 'fas fa-user-friends',
	음악: 'fas fa-music',
	'IT & 과학': 'fas fa-flask',
	봇: 'fas fa-robot',
	교육: 'fas fa-graduation-cap',
	연애: 'fas fa-hand-holding-heart',
	게임: 'fas fa-gamepad',
	오버워치: 'fas fa-mask',
	'리그 오브 레전드': 'fas fa-chess',
	배틀그라운드: 'fas fa-meteor',
	마인크래프트: 'fas fa-cubes',
}

export const reportCats = [
	'위법',
	'봇을 이용한 테러',
	'괴롭힘, 모욕, 명예훼손',
	'스팸, 도배, 의미없는 텍스트',
	'폭력, 자해, 테러 옹호하거나 조장하는 콘텐츠',
	'오픈소스 라이선스, 저작권 위반 등 권리 침해',
	'Discord ToS 또는 한국 디스코드 리스트 가이드라인 위반',
	'기타',
]

export const serverReportCats = [
	'위법',
	'괴롭힘, 모욕, 명예훼손',
	'폭력, 자해, 테러 옹호하거나 조장하는 콘텐츠',
	'저작권 위반 등 권리 침해',
	'Discord ToS 또는 한국 디스코드 리스트 가이드라인 위반',
	'기타',
]

export const imageSafeHost = ['koreanbots.dev', 'githubusercontent.com', 'cdn.discordapp.com']

export const MessageColor = {
	success: 'bg-emerald-200 text-emerald-800',
	error: 'bg-red-200 text-red-800',
	warning: 'bg-amber-50 text-amber-700',
	info: 'bg-blue-200 text-blue-800',
}

export const BASE_URLs = {
	api: 'https://discord.com/api',
	invite: 'https://discord.gg',
	cdn: 'https://cdn.discordapp.com',
	camo: 'https://camo.koreanbots.dev',
}

export const BotBadgeType = (data: Bot) => {
	return {
		servers: {
			label: '서버수',
			status: data.servers === 0 ? 'N/A' : formatNumber(data.servers),
			color: '7289DA',
		},
		votes: {
			label: '하트',
			status: `${formatNumber(data.votes)}`,
			color: 'ef4444',
		},
		status: {
			label: '상태',
			status: Status[data.status]?.text || '알 수 없음',
			color:
				{
					online: '34d399',
					idle: 'fcd34d',
					dnd: 'ef4444',
					streaming: '8b5cf6',
				}[data.status] || '6b7280',
		},
	}
}

export const ServerBadgeType = (data: Server) => {
	return {
		members: {
			label: '멤버수',
			status: !data.members ? 'N/A' : formatNumber(data.members),
			color: '7289DA',
		},
		votes: {
			label: '하트',
			status: `${formatNumber(data.votes)}`,
			color: 'ef4444',
		},
		boost: {
			label: '부스트',
			status: `${!data.boostTier ? 0 : data.boostTier}레벨`,
			color: 'fe73fa',
		},
	}
}

export const DiscordEnpoints = {
	Token: BASE_URLs.api + '/oauth2/token',
	Me: BASE_URLs.api + '/v9/users/@me',
	Guilds: BASE_URLs.api + '/v9/users/@me/guilds',
	InviteApplication: (
		id: string,
		perms: { [perm: string]: boolean },
		scope: string,
		redirect?: string,
		guild_id?: string
	): string =>
		`${BASE_URLs.api}/oauth2/authorize?client_id=${
			id ? id.split(' ')[0] : 'CLIENT_ID'
		}&permissions=${Object.keys(perms)
			.filter((el) => perms[el])
			.map((el) => Number(el))
			.reduce((prev, curr) => BigInt(prev) | BigInt(curr), BigInt(0))}&scope=${
			scope ? encodeURI(scope) : 'bot'
		}${redirect ? `&redirect_uri=${encodeURIComponent(redirect)}` : ''}${
			guild_id ? `&guild_id=${guild_id}` : ''
		}`,
	ServerInvite: (code: string): string => `${BASE_URLs.invite}/${code}`,
	CDN: class CDN {
		static root = BASE_URLs.cdn
		static emoji(id: string, options: ImageOptions = {}) {
			return makeImageURL(`${this.root}/emojis/${id}`, options)
		}
		static guild(id: string, hash: string, options: ImageOptions = {}) {
			return makeImageURL(`${this.root}/icons/${id}/${hash}`, options)
		}
		static default(tag: string | number, options: ImageOptions = {}) {
			return makeImageURL(
				`${this.root}/embed/avatars/${!isNaN(Number(tag)) ? Number(tag) % 5 : 0}`,
				options
			)
		}
		static user(id: string, hash: string, options: ImageOptions = {}) {
			return makeImageURL(`${this.root}/avatars/${id}/${hash}`, options)
		}
	},
}

export const KoreanbotsEndPoints = {
	OG: class {
		static root = 'https://og.koreanbots.dev'
		static origin = 'https://koreanbots.dev'
		static generate(
			id: string,
			name: string,
			bio: string,
			tags: string[],
			stats: string[],
			type: 'bot' | 'server'
		) {
			const u = new URL(this.root)
			u.pathname = name + '.png'
			u.searchParams.append(
				'image',
				this.origin +
					(type === 'bot'
						? KoreanbotsEndPoints.CDN.avatar(id, { format: 'webp', size: 256 })
						: KoreanbotsEndPoints.CDN.icon(id, { format: 'webp', size: 256 }))
			)
			u.searchParams.append('bio', bio)
			u.searchParams.append('type', type)
			tags.map((t) => u.searchParams.append('tags', t))
			stats.map((s) => u.searchParams.append('stats', s))
			return u.href
		}
		static bot(id: string, name: string, bio: string, tags: string[], stats: string[]) {
			return this.generate(id, name, bio, tags, stats, 'bot')
		}
		static server(id: string, name: string, bio: string, tags: string[], stats: string[]) {
			return this.generate(id, name, bio, tags, stats, 'server')
		}
	},
	CDN: class {
		static root = '//cdn.koreanbots.dev'
		static avatar(id: string, options: KoreanbotsImageOptions) {
			return makeImageURL(`${this.root}/avatars/${id}`, options)
		}
		static icon(id: string, options: KoreanbotsImageOptions) {
			return makeImageURL(`${this.root}/icons/${id}`, options)
		}
	},
	URL: class {
		static root = process.env.KOREANBOTS_URL || 'https://koreanbots.dev'
		static bot(id: string) {
			return `${this.root}/bots/${id}`
		}
		static server(id: string) {
			return `${this.root}/servers/${id}`
		}
		static user(id: string) {
			return `${this.root}/users/${id}`
		}
		static submittedBot(id: string, date: number) {
			return `${this.root}/pendingBots/${id}/${date}`
		}
		static searchBot(query: string) {
			return `${this.root}/bots/search?q=${encodeURIComponent(query)}`
		}
		static searchServer(query: string) {
			return `${this.root}/servers/search?q=${encodeURIComponent(query)}`
		}
	},
	baseAPI: '/api/v2',
	login: '/api/auth/discord',
	logout: '/api/auth/discord/logout',
}

export const SpecialEndPoints = {
	Github: {
		Content: (owner: string, repo: string, path: string) =>
			`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
		Token: (clientID: string, clientSecret: string, code: string) =>
			`https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
		Me: 'https://api.github.com/user',
	},
	HCaptcha: {
		Verify: 'https://hcaptcha.com/siteverify',
	},
}

export const GlobalRatelimitIgnore = ['/api/image/discord/avatars/']

export const Oauth = {
	discord: (clientID: string, scope: string) =>
		`https://discord.com/oauth2/authorize?client_id=${clientID}&scope=${scope}&permissions=0&response_type=code&redirect_uri=${process.env.KOREANBOTS_URL}/api/auth/discord/callback&prompt=none`,
	github: (clientID: string) =>
		`https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${process.env.KOREANBOTS_URL}/api/auth/github/callback`,
}
export const git = {
	'github.com': { icon: 'github', text: 'GitHub' },
	'gitlab.com': { icon: 'gitlab', text: 'GitLab' },
}

export const KoreanbotsDiscord = 'https://discord.gg/JEh53MQ'
export const ThemeColors = [
	{ name: '파랑', rgb: 'rgb(51, 102, 255)', hex: '#3366FF', color: 'koreanbots-blue' },
	{ name: '하양', rgb: 'rgb(251, 251, 251)', hex: '#FBFBFB', color: 'little-white' },
	{ name: '검정', rgb: 'rgb(27, 30, 35)', hex: '#1B1E23', color: 'very-black' },
	{ name: '보라', rgb: 'rgb(88, 101, 242)', hex: '#5865f2', color: 'discord-blurple' },
]
export const KoreanbotsEmoji = [
	{
		name: '한국 디스코드 리스트',
		short_names: ['koreanbots', 'kbots', 'dbkr'],
		emoticons: [],
		keywords: ['koreanbots', '한국 디스코드 리스트', '한디리', 'kbots'],
		imageUrl: '/logo.png',
	},
	{
		name: 'Discord',
		short_names: ['discord'],
		emoticons: [],
		keywords: ['discord', '디스코드', '디코'],
		imageUrl: '/emojis/discord.svg',
	},
	{
		name: 'Javascript',
		short_names: ['javascript', 'js'],
		emoticons: [],
		keywords: ['javascript', 'js', '자바스크립트'],
		imageUrl: '/emojis/javascript.png',
	},
	{
		name: 'Python',
		short_names: ['python', 'py'],
		emoticons: [],
		keywords: ['python', 'py', '파이썬'],
		imageUrl: '/emojis/python.png',
	},
]

export const shortcutKeyMap: KeyMap = {
	SHORTCUT_HELP: ['command+/', 'ctrl+/'],
	CHANGE_THEME: ['command+shift+d', 'ctrl+shift+d'],
}

export const ErrorText = {
	DEFAULT: '예상치 못한 에러가 발생하였습니다.',
	400: '올바르지 않은 요청입니다.',
	401: '로그인이 필요합니다.',
	402: '결제가 필요합니다.',
	403: '권한이 없습니다.',
	404: '페이지가 존재하지 않습니다.',
	405: '해당 요청 방법은 허용되지 않습니다.',
	406: '연결을 받아드릴 수 없습니다.',
	429: '지정된 시간에 너무 많은 요청을 보내셨습니다. 잠시 후 다시 시도해주세요.',
	500: '서버 내부 오류가 발생하였습니다.',
	502: '올바르지 않은 게이트웨이입니다.',
}

export const ErrorMessage = [
	'지나가던 고양이가 선을 밟았어요..',
	'무언가 잘못되었어요..!',
	'이게 아닌데...',
	'어쩜 이렇게 오류가 또 나는건지?',
]

export const ServerIntroList = [
	'한국어를 배울 수 있는 최고의 공간입니다!',
	'김치의 다양한 요리법을 소개하는 서버입니다.',
	'좋아하는 노래를 들을 수 있는 곳 입니다.',
	'게임을 함께 할 사람을 찾을 수 있습니다.',
]
export const BotSubmissionDenyReasonPresetsName = {
	MISSING_VERIFY: '개발자 확인 불가',
	OFFLINE: '봇 오프라인',
	INVALID_CATEGORY: '올바르지 않은 카테고리',
	PRIVATE: '프라이빗 봇',
	LICENSE_VIOLATION: '오픈소스 라이선스 위반',
	ABSENT_AT_DISCORD: '공식 디스코드 서버 미참여',
}

export const GuildPermissions = {
	general: [
		{
			name: '채널 보기',
			flag: 0x00000400,
		},
		{
			name: '채널 관리하기',
			flag: 0x00000010,
			twofactor: true,
		},
		{
			name: '역할 관리하기',
			flag: 0x10000000,
			twofactor: true,
		},
		{
			name: '이모티콘 관리하기',
			flag: 0x40000000,
			twofactor: true,
		},
		{
			name: '감사 로그 보기',
			flag: 0x00000080,
		},
		{
			name: '웹후크 관리하기',
			flag: 0x20000000,
			twofactor: true,
		},
		{
			name: '서버 관리하기',
			flag: 0x00000020,
			twofactor: true,
		},
	],
	membership: [
		{
			name: '초대 코드 만들기',
			flag: 0x00000001,
		},
		{
			name: '별명 변경하기',
			flag: 0x04000000,
		},
		{
			name: '별명 관리하기',
			flag: 0x08000000,
		},
		{
			name: '멤버 추방하기',
			flag: 0x00000002,
			twofactor: true,
		},
		{
			name: '멤버 차단하기',
			flag: 0x00000004,
			twofactor: true,
		},
	],
	channel: [
		{
			name: '메세지 보내기',
			flag: 0x00000800,
		},
		{
			name: '링크 첨부',
			flag: 0x00004000,
		},
		{
			name: '파일 첨부',
			flag: 0x00008000,
		},
		{
			name: '반응 추가하기',
			flag: 0x00000040,
		},
		{
			name: '외부 이모티콘 사용',
			flag: 0x00040000,
		},
		{
			name: '@everyone, @here 모든 역할 멘션하기',
			flag: 0x00020000,
		},
		{
			name: '메세지 관리',
			flag: 0x00002000,
			twofactor: true,
		},
		{
			name: '메세지 기록 보기',
			flag: 0x00010000,
		},
		{
			name: '텍스트 음성 변환 메세지 전송',
			flag: 0x00001000,
		},
		{
			name: '빗금 명령어 사용',
			flag: 0x80000000,
		},
	],
	voice: [
		{
			name: '연결',
			flag: 0x00100000,
		},
		{
			name: '말하기',
			flag: 0x00200000,
		},
		{
			name: '동영상',
			flag: 0x00000200,
		},
		{
			name: '음성 감지 사용',
			flag: 0x02000000,
		},
		{
			name: '우선 발언권',
			flag: 0x00000100,
		},
		{
			name: '멤버들의 마이크 음소거하기',
			flag: 0x00400000,
		},
		{
			name: '멤버의 헤드셋 음소거하기',
			flag: 0x00800000,
		},
		{
			name: '멤버 이동',
			flag: 0x01000000,
		},
	],
	advanced: [
		{
			name: '관리자',
			flag: 0x8,
			twofactor: true,
		},
	],
}
