export async function getGithubContent(repo: string, path: string): Promise<string> {
	const url = `https://raw.githubusercontent.com/koreanbots/${repo}/HEAD/${path}`
	const res = await fetch(url)
	if (!res.ok) {
		throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
	}
	return res.text()
}
