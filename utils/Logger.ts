const Logger = {
	debug: function(message: string) {
		print('DEBUG', message, genStyle('cyan'))
	},
	warn: function(message: string) {
		print('WARN', message, genStyle('yellow'))
	},
	error: function(message: string) {
		print('ERROR', message, genStyle('red', 'white'))
	},
}

function genStyle(bg: string, text = 'black') {
	return `color:${text};background:${bg};padding:1px 3px;border-radius:2px;margin-right:5px;`
}

function print(level: string, message: string, style: string) {
	console.log(`%c${level}` + `%c${message}`, style, '')
}
export default Logger
