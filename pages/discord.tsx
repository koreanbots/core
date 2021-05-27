import { KoreanbotsDiscord } from '@utils/Constants'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Redirect = dynamic(() => import('@components/Redirect'))

const Discord:NextPage = () => {
	return <Redirect to={KoreanbotsDiscord}/>
}

export default Discord