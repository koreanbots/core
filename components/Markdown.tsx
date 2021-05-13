import MarkdownView from 'react-showdown'
import sanitizeHtml from 'sanitize-html'
import Emoji from 'node-emoji'
import { FunctionComponent } from 'react'

import { anchorHeader, customEmoji, twemoji } from '@utils/Tools'

const Markdown = ({ text, options={}, allowedTag=[], components={} }: MarkdownProps): JSX.Element => {
	return (
		<div className='markdown-body w-full'>
			<MarkdownView
				markdown={Emoji.emojify(text)}
				extensions={[twemoji, customEmoji, anchorHeader]}
				options={{
					openLinksInNewWindow: true,
					underline: true,
					omitExtraWLInCodeBlocks: true,
					literalMidWordUnderscores: true,
					simplifiedAutoLink: true,
					tables: true,
					strikethrough: true,
					smoothLivePreview: true,
					tasklists: true,
					ghCompatibleHeaderId: true,
					encodeEmails: true,
					...options
				}}
				components={components}
				sanitizeHtml={html =>
					sanitizeHtml(html, {
						allowedTags: [
							'addr',
							'address',
							'article',
							'aside',
							'h1',
							'h2',
							'h3',
							'h4',
							'h5',
							'h6',
							'section',
							'blockquote',
							'dd',
							'div',
							'dl',
							'dt',
							'hr',
							'li',
							'ol',
							'p',
							'pre',
							'ul',
							'a',
							'abbr',
							'b',
							'bdi',
							'bdo',
							'br',
							'cite',
							'code',
							'data',
							'dfn',
							'em',
							'i',
							'kbd',
							'mark',
							'q',
							'rb',
							'rp',
							'rt',
							'rtc',
							'ruby',
							's',
							'samp',
							'small',
							'span',
							'strong',
							'sub',
							'sup',
							'time',
							'u',
							'var',
							'wbr',
							'caption',
							'col',
							'colgroup',
							'table',
							'tbody',
							'td',
							'tfoot',
							'th',
							'thead',
							'tr',
							'del',
							'img',
							'svg',
							'path',
							'input',
							...allowedTag
						],
						allowedAttributes: false,
						allowedClasses: {
							'*': ['align-middle'],
							a: ['anchor', 'mr-1'],
							svg: ['octicon-link'],
							img: ['emoji', 'special']
						},
						allowedStyles: {}
					})
				}
			/>
		</div>
	)
}

interface MarkdownProps {
	text: string
	options?: {
		[key: string]: boolean
	}
	allowedTag?: string[]
	components?: Record<string, FunctionComponent>
}

export default Markdown
