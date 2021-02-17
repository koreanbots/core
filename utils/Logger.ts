export class Logger {
	private static genStyle(bg: string, text='black') {
		return `color:${text};background:${bg};padding:1px 3px;border-radius:2px;margin-right:5px;`
	}

	private static print(level: string, message: string, style: string) {
		console.log(`%c${level}` + `%c${message}`, style, '')
	}

	static debug(message: string) {
		this.print('DEBUG', message, this.genStyle('cyan'))
	}

	static warn(message: string) {
		this.print('WARN', message, this.genStyle('yellow'))
	}

	static error(message: string) {
		this.print('ERROR', message, this.genStyle('red', 'white'))
	}
}