import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import { ErrorText } from '@utils/Constants'

const Button = dynamic(() => import('@components/Button'))

const Forbidden: React.FC = () => {
	const router = useRouter()
	return (
		<>
			<NextSeo title='권한이 없습니다' />
			<div className='flex h-screen select-none items-center justify-center'>
				<div className='container mx-auto px-20 text-center md:text-left'>
					<h1 className='text-8xl font-semibold'>403</h1>
					<h2 className='py-2 text-2xl font-semibold'>{ErrorText[403]}</h2>
					<Button onClick={router.back}>뒤로 가기</Button>
					<p className='mt-2 text-sm text-gray-400'>
						해당 작업을 수행할 수 있는 권한이 없습니다. 무언가 잘못된 것 같다면 문의해주세요.
					</p>
				</div>
			</div>
		</>
	)
}

export default Forbidden
