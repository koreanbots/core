// eslint-disable-next-line @typescript-eslint/no-var-requires
const tracer = require('dd-trace')

tracer.init({ debug: true })

module.exports = tracer