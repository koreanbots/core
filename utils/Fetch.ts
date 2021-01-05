import DataLoader from 'dataloader'
import * as Query from './Query'

const loaders = {
	user: new DataLoader(async(ids:string) => await Query.getUser(ids))
}