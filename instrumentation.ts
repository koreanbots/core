export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		const { tracer } = await import('dd-trace')
		const packageJson = await import('package.json')
		tracer.init({
			service: 'koreanbots',
			version: packageJson.version,
			env: process.env.DD_ENV,
		})
	}
}
