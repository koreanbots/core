import urlRegex from 'url-regex'

export const ID = /[0-9]{17,}/
export const Vanity = /[A-z|\d|-]+/
export const Prefix = /^[^\s]/
export const HTTPProtocol = /^https?:\/\/.*?/
export const Url = urlRegex({ strict: true })