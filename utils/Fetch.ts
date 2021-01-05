import DataLoader from 'dataloader'
import * as Query from './Query'

const loaders = {
	bor: new DataLoader(async (ids:string[]) => await Promise.all(ids.map((el:string)=> Query.getBot(el)))),
	user: new DataLoader(async (ids:string[]) => await Promise.all(ids.map((el:string)=> Query.getUser(el)))),
}

