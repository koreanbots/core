import { ResponseProps } from '@types'
import { KoreanbotsEndPoints } from './Constants'

const Fetch = async <T>(endpoint: string, options?: RequestInit): Promise<ResponseProps<T>> => {
	const url = KoreanbotsEndPoints.baseAPI + (endpoint.startsWith('/') ? endpoint : '/' + endpoint)

	const res = await fetch(url, {
		method: 'GET',
		headers: { 'content-type': 'application/json', ...options.headers },
		...options,
	})

	let json = {}

	try {
		json = await res.json()
	} catch {
		json = { code: 500, message: 'Internal Server Error' }
	}

	return json
}

export default Fetch
