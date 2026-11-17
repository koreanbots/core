import { DiscordEnpoints } from '../utils/Constants'
import { checkUserFlag, formatNumber } from '../utils/Tools'

test('format Number', () => {
	expect(formatNumber(995)).toBe('1천')
	expect(formatNumber(1000)).toBe('1천')
	expect(formatNumber(33333)).toBe('3.3만')
	expect(formatNumber(600)).toBe('600')
	expect(formatNumber(1300)).toBe('1천')
	expect(formatNumber(9999)).toBe('1만')
	expect(formatNumber(959999)).toBe('96만')
	expect(formatNumber(999999)).toBe('100만')
	expect(formatNumber(9999999)).toBe('1000만')
	expect(formatNumber(10000000)).toBe('1000만')
	expect(formatNumber(12345678)).toBe('1200만')
	expect(formatNumber(99999999)).toBe('1억')
	expect(formatNumber(123456789)).toBe('1.2억')
	expect(formatNumber(1e16)).toBe('1경')
})

test('checking Permission', () => {
	expect(checkUserFlag(0x0, 0x0)).toBe(true)
	expect(checkUserFlag(0x1, 0x4)).toBe(false)
	expect(checkUserFlag(0, 'staff')).toBe(false)
	expect(checkUserFlag(0x2, 'staff')).toBe(false)
})

test('check CDN URL', () => {
	expect(
		DiscordEnpoints.CDN.user('000000000000000000', 'abcdefghijklm', { format: 'jpg', size: 1024 })
	).toBe('https://cdn.discordapp.com/avatars/000000000000000000/abcdefghijklm.jpg?size=1024')
})

export {}
