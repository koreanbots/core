import { Bot, ImageOptions, KoreanbotsImageOptions } from '@types'
import { KeyMap } from 'react-hotkeys'
import { formatNumber, makeImageURL } from './Tools'

export const VOTE_COOLDOWN = 12 * 60 * 60 * 1000
export const BUG_REPORTERS = ['345265069132742657', '260303569591205888']
export const Status = {
	online: {
		text: '온라인',
		color: 'green-400',
	},
	idle: {
		text: '자리 비움',
		color: 'yellow-300',
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
		color: 'purple-500'
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

export const categories = [
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
	'마인크래프트'
]

export const categoryIcon = {
	'관리': 'fas fa-cogs',
	'뮤직': 'fas fa-music',
	'전적': 'fas fa-puzzle-piece',
	'웹 대시보드': 'fas fa-sliders-h',
	'로깅': 'fas fa-pencil-alt',
	'빗금 명령어': null,
	'도박': 'fas fa-money-bill-alt',
	'게임': 'fas fa-gamepad',
	'밈': 'fas fa-image',
	'레벨링': 'fas fa-angle-double-up',
	'유틸리티': 'fas fa-tools',
	'번역': 'fas fa-language',
	'대화': 'fas fa-comments',
	'NSFW': 'fas fa-exclamation-triangle',
	'검색': 'fas fa-search',
	'학교': 'fas fa-school',
	'코로나19': 'fas fa-viruses',
	'오버워치': 'fas fa-mask',
	'리그 오브 레전드': 'fas fa-chess',
	'배틀그라운드': 'fas fa-meteor',
	'마인크래프트': 'fas fa-cubes'
}

export const reportCats = [
	'불법',
	'괴롭힘, 모욕, 명예훼손',
	'스팸, 도배, 의미없는 텍스트',
	'폭력, 자해, 테러 옹호하거나 조장하는 컨텐츠',
	'라이선스혹은 권리 침해',
	'Discord ToS 위반',
	'Koreanbots 가이드라인 위반',
	'기타',
]

export const imageSafeHost = [
	'koreanbots.dev',
	'githubusercontent.com',
	'cdn.discordapp.com'	
]

export const MessageColor = {
	success: 'bg-green-200 text-green-800',
	error: 'bg-red-200 text-red-800',
	warning: 'bg-yellow-50 text-yellow-700',
	info: 'bg-blue-200 text-blue-800'
}

export const BASE_URLs = {
	api: 'https://discord.com/api',
	cdn: 'https://cdn.discordapp.com',
	camo: 'https://camo.koreanbots.dev'
}

export const BotBadgeType = (data: Bot) => {
	return {
		servers: {
			label: '서버수',
			status: data.servers === 0 ? 'N/A' : formatNumber(data.servers),
			color: '7289DA'
		},
		votes: {
			label: '하트',
			status: `${formatNumber(data.votes)}`,
			color: 'ef4444'
		},
		status: {
			label: '상태',
			status: Status[data.status]?.text || '알 수 없음',
			color: {
				online: '34d399',
				idle: 'fcd34d',
				dnd: 'ef4444',
				streaming: '8b5cf6'
			}[data.status] || '6b7280'
		}
	}
}

export const DiscordEnpoints = {
	Token: BASE_URLs.api + '/oauth2/token',
	Me: BASE_URLs.api + '/v8/users/@me',
	InviteApplication: (id: string, perms: { [perm: string]: boolean }, scope: string, redirect?: string): string => `${BASE_URLs.api}/oauth2/authorize?client_id=${id ? id.split(' ')[0] : 'CLIENT_ID'}&permissions=${Object.keys(perms).filter(el => perms[el]).map(el => Number(el)).reduce((prev, curr) => prev | curr, 0)}&scope=${scope ? encodeURI(scope) : 'bot'}${redirect ? `&redirect_uri=${encodeURIComponent(redirect)}` : ''}`,
	CDN: class CDN {
		static root = BASE_URLs.cdn
		static emoji (id: string, options:ImageOptions={}) { return makeImageURL(`${this.root}/emojis/${id}`, options) }
		static guild (id: string, hash: string, options:ImageOptions={}) { return makeImageURL(`${this.root}/icons/${id}/${hash}`, options) }
		static default (tag: string|number, options:ImageOptions={}) { return makeImageURL(`${this.root}/embed/avatars/${!isNaN(Number(tag)) ? Number(tag) % 5 : 0}`, options) }
		static user (id: string, hash: string, options:ImageOptions={}) { return makeImageURL(`${this.root}/avatars/${id}/${hash}`, options) }
	}
}

export const KoreanbotsEndPoints = {
	CDN: class CDN {
		static avatar (id: string, options: KoreanbotsImageOptions) { return makeImageURL(`/api/image/discord/avatars/${id}`, options) }
	},
	baseAPI: '/api/v2',
	login: '/api/auth/discord',
	logout: '/api/auth/discord/logout'
}

export const SpecialEndPoints = {
	Github: {
		Token: (clientID: string, clientSecret: string, code: string) => `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
		Me: 'https://api.github.com/user'
	},
	HCaptcha: {
		Verify: 'https://hcaptcha.com/siteverify'
	}
}

export const GlobalRatelimitIgnore = [
	'/api/image/discord/avatars/'
]

export const Oauth = {
	discord: (clientID: string, scope: string) => `https://discord.com/oauth2/authorize?client_id=${clientID}&scope=${scope}&permissions=0&response_type=code&redirect_uri=${process.env.KOREANBOTS_URL}/api/auth/discord/callback&prompt=none`,
	github: (clientID: string) => `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${process.env.KOREANBOTS_URL}/api/auth/github/callback`
}
export const git = { 'github.com': { icon: 'github', text: 'Github' },  'gitlab.com':  { icon: 'gitlab', text: 'Gitlab' }}

export const KoreanbotsDiscord = 'https://discord.gg/JEh53MQ'
export const ThemeColors = [{ name: '파랑', rgb: 'rgb(51, 102, 255)', hex: '#3366FF', color: 'koreanbots-blue' }, { name: '하양', rgb: 'rgb(251, 251, 251)', hex: '#FBFBFB', color: 'little-white' }, { name: '검정', rgb: 'rgb(27, 30, 35)', hex: '#1B1E23', color: 'very-black' }, { name: '보라', rgb: 'rgb(114, 137, 218)', hex: '#7289DA', color: 'discord-blurple' } ]
export const KoreanbotsEmoji = [{
	name: '한국 디스코드봇 리스트',
	short_names: ['koreanbots', 'kbots', 'dbkr'],
	emoticons: [],
	keywords: ['koreanbots', '한국 디스코드봇 리스트', '한디리', 'kbots'],
	imageUrl: '/logo.png'
},
{
	name: 'Discord',
	short_names: ['discord'],
	emoticons: [],
	keywords: ['discord', '디스코드', '디코'],
	imageUrl: '/emojis/discord.svg'
},
{
	name: 'Javascript',
	short_names: ['javascript', 'js'],
	emoticons: [],
	keywords: ['javascript', 'js', '자바스크립트'],
	imageUrl: '/emojis/javascript.png'
},
{
	name: 'Python',
	short_names: ['python', 'py'],
	emoticons: [],
	keywords: ['python', 'py', '파이썬'],
	imageUrl: '/emojis/python.png'
}]

export const shortcutKeyMap: KeyMap = {
	SHORTCUT_HELP: ['command+/', 'ctrl+/'],
	CHANGE_THEME: ['command+shift+d', 'ctrl+shift+d']
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
	502: '올바르지 않은 게이트웨이입니다.'
}

export const ErrorMessage = ['지나가던 고양이가 선을 밟았어요..', '무언가 잘못되었어요..!', '이게 아닌데...', '어쩜 이렇게 오류가 또 나는건지?']

export const GuildPermissions = {
	general: [
		{
			name: '채널 보기',
			flag: 0x00000400
		},
		{
			name: '채널 관리하기',
			flag: 0x00000010,
			twofactor: true
		},
		{
			name: '역할 관리하기',
			flag: 0x10000000,
			twofactor: true
		},
		{
			name: '이모티콘 관리하기',
			flag: 0x40000000,
			twofactor: true
		},
		{
			name: '감사 로그 보기',
			flag: 0x00000080
		},
		{
			name: '웹후크 관리하기',
			flag: 0x20000000,
			twofactor: true
		},
		{
			name: '서버 관리하기',
			flag: 0x00000020,
			twofactor: true
		}
	],
	membership: [
		{
			name: '초대 코드 만들기',
			flag: 0x00000001
		},
		{
			name: '별명 변경하기',
			flag: 0x04000000
		},
		{
			name: '별명 관리하기',
			flag: 0x08000000
		},
		{
			name: '멤버 추방하기',
			flag: 0x00000002,
			twofactor: true
		},
		{
			name: '멤버 차단하기',
			flag: 0x00000004,
			twofactor: true
		}
	],
	channel: [
		{
			name: '메세지 보내기',
			flag: 0x00000800
		},
		{
			name: '링크 첨부',
			flag: 0x00004000
		},
		{
			name: '파일 첨부',
			flag: 0x00008000
		},
		{
			name: '반응 추가하기',
			flag: 0x00000040
		},
		{
			name: '외부 이모티콘 사용',
			flag: 0x00040000
		},
		{
			name: '@everyone, @here 모든 역할 멘션하기',
			flag: 0x00020000
		},
		{
			name: '메세지 관리',
			flag: 0x00002000,
			twofactor: true
		},
		{
			name: '메세지 기록 보기',
			flag: 0x00010000
		},
		{
			name: '텍스트 음성 변환 메세지 전송',
			flag: 0x00001000
		},
		{
			name: '빗금 명령어 사용',
			flag: 0x80000000
		}
	],
	voice: [
		{
			name: '연결',
			flag: 0x00100000
		},
		{
			name: '말하기',
			flag: 0x00200000
		},
		{
			name: '동영상',
			flag: 0x00000200

		},
		{
			name: '음성 감지 사용',
			flag: 0x02000000
		},
		{
			name: '우선 발언권',
			flag: 0x00000100
		},
		{
			name: '멤버들의 마이크 음소거하기',
			flag: 0x00400000
		},
		{
			name: '멤버의 헤드셋 음소거하기',
			flag: 0x00800000
		},
		{
			name: '멤버 이동',
			flag: 0x01000000
		}
	],
	advanced: [
		{
			name: '관리자',
			flag: 0x8,
			twofactor: true
		}
	]
}