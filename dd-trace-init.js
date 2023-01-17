// eslint-disable-next-line @typescript-eslint/no-var-requires
const tracer = require('dd-trace')

tracer.init({
	debug: process.env.DD_DEBUG==='true' || false,
})

module.exports = tracer