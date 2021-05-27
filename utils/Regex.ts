import urlRegex from 'url-regex-safe'

export const ID = /^[0-9]{17,}$/
export const Vanity = /^[A-Za-z\d-]+$/
export const Prefix = /^[^\s]/
export const HTTPProtocol = /^https?:\/\/.*?/
export const Url = urlRegex({ strict: true })

export const Emoji =
	'(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])'
export const Heading = '<h\\d id="(.+?)">(.*?)<\\/h(\\d)>'
export const EmojiSyntax = ':(\\w+):'
export const ImageTag = /<img\s[^>]*?alt\s*=\s*['"]([^'"]*?)['"][^>]*?>/
export const markdownImage = /!\[([^\]]*)\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g