import DataLoader from 'dataloader'
import * as Query from './Query'

const Fetch = {
	bot: new DataLoader(async (ids:string[]) => await Promise.all(ids.map((el:string)=> Query.getBot(el))), {
		batchScheduleFn: callback => setTimeout(callback, 1000)
	}),
	user: new DataLoader(async (ids:string[]) => await Promise.all(ids.map((el:string)=> Query.getUser(el))), {
		batchScheduleFn: callback => setTimeout(callback, 1000)
	}),
}

export default Fetch