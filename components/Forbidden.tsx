import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { ErrorText } from '@utils/Constants'

const SEO = dynamic(() => import('@components/SEO'))
const Button = dynamic(() => import('@components/Button'))

const Forbidden = ():JSX.Element => {
	const router = useRouter()
	return <>
		<SEO title='권한이 없습니다' />
		<div className='flex items-center justify-center h-screen select-none'>
			<div className='container mx-auto px-20 md:text-left text-center'>
				<h1 className='text-8xl font-semibold'>403</h1>
				<h2 className='text-2xl font-semibold py-2'>
					{ErrorText[403]}
				</h2>
				<Button onClick={router.back}>뒤로 가기</Button>
				<p className='text-gray-400 text-sm mt-2'>해당 작업을 수행할 수 있는 권한이 없습니다. 무언가 잘못된 거 같다면 문의해주세요.</p>
			</div>
		</div>
	</>
}

export default Forbidden
