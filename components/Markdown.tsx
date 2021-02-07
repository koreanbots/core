import { anchorHeader, customEmoji, twemoji } from '@utils/Tools'
import MarkdownView from 'react-showdown'
import sanitizeHtml from 'sanitize-html'
import Emoji from 'node-emoji'

const Markdown = ({ text }:MarkdownProps):JSX.Element => {
	return <div className='w-full markdown-body'>
		<MarkdownView markdown={Emoji.emojify(text)} extensions={[ twemoji, customEmoji, anchorHeader ]} options={{ openLinksInNewWindow: true, underline: true, omitExtraWLInCodeBlocks: true, literalMidWordUnderscores: true, simplifiedAutoLink: true, tables: true, strikethrough: true, smoothLivePreview: true, tasklists: true, ghCompatibleHeaderId: true, encodeEmails: true }} sanitizeHtml={(html)=> sanitizeHtml(html, {
			allowedTags: [
				'addr', 'address', 'article', 'aside', 'h1', 'h2', 'h3', 'h4',
				'h5', 'h6', 'section', 'blockquote', 'dd', 'div',
				'dl', 'dt', 'hr', 'li', 'ol', 'p', 'pre',
				'ul', 'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn',
				'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp',
				'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'caption',
				'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'del',
				'img', 'svg', 'path', 'input'
			],
			allowedAttributes: false
		})} />
	</div>
}

interface MarkdownProps {
  text: string
}

export default Markdown