import { Emoji, EmojiSyntax, Heading, ImageTag } from './Regex'
import Twemoji from 'twemoji'
import { KoreanbotsEmoji } from './Constants'

export const anchorHeader = {
	type:    'output',
	regex:   Heading,
	replace: function (__match: string, id:string, title:string, level:number): string {

		// github anchor style
		const href = id.replace(ImageTag, '$1').replace(/"/gi, '')
		const octicon_html = `<a class="anchor mr-1 align-middle" aria-hidden="true" href="#${href}">
			<svg fill="currentColor" class="octicon-link align-middle" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
			<path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
			</svg>
		</a>`

		return `<h${level} id="${href}">${octicon_html}${title}</h${level}>`
	}
}

export const twemoji = {
	type: 'output',
	regex: `${Emoji}{1,2}`,
	replace: function(__match: string, two: string, one: string) {
		const parsed = __match || two || one
		const emoj = Twemoji.parse(parsed, { folder: 'svg', ext: '.svg' })
		if(!emoj) return parsed
		return emoj
	} 
}

export const customEmoji = {
	type: 'output',
	regex: EmojiSyntax,
	replace: function(__match: string, name: string): string {
		const result = KoreanbotsEmoji.find(el => el.short_names.includes(name))
		if(!name || !result) return `:${name}:`
		return `<img class="emoji special" draggable="false" alt="${name}" src="${result.imageUrl}"/>`
	}
}
