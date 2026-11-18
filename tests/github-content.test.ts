import { getGithubContent } from '../utils/GithubContent'

const originalFetch = global.fetch

afterEach(() => {
	global.fetch = originalFetch
})

test.each([
	['terms', 'community-rule.md'],
	['terms', 'guidelines.md'],
	['terms', 'privacy-policy.md'],
	['terms', 'tos.md'],
	['verification', 'README.md'],
])('loads the raw document %s/%s', async (repo, path) => {
	global.fetch = jest.fn().mockResolvedValue({
		ok: true,
		text: async () => '# 한국어 문서',
	})

	expect(await getGithubContent(repo, path)).toBe('# 한국어 문서')
	expect(global.fetch).toHaveBeenCalledWith(
		`https://raw.githubusercontent.com/koreanbots/${repo}/HEAD/${path}`
	)
})

test('reports failed document requests instead of rendering an error response', async () => {
	global.fetch = jest.fn().mockResolvedValue({
		ok: false,
		status: 404,
		statusText: 'Not Found',
	})

	await expect(getGithubContent('terms', 'missing.md')).rejects.toThrow(
		'Failed to fetch https://raw.githubusercontent.com/koreanbots/terms/HEAD/missing.md: 404 Not Found'
	)
})
