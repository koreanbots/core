import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { SpecialEndPoints } from '@utils/Constants'


const Button = dynamic(() => import('@components/Button'))
const Divider = dynamic(() => import('@components/Divider'))
const Docs = dynamic(()=> import('@components/Docs'))
const Markdown = dynamic(() => import('@components/Markdown'))


const Verification: NextPage<VerificationProps> = ({ content }) => {
	return (
		<Docs
			header='인증'
			description='한국 디스코드 리스트의 신뢰된 봇은 디스코드 인증보다 더 자세한 기준으로 신뢰성을 주기 위한 제도입니다.'
		>
			<Markdown text={content} />
			<Divider />
			<div className='text-center pt-10'>
				<h2 className='text-2xl font-bold mb-6'>지금 바로 신청하세요</h2>
				<Button href='https://github.com/koreanbots/verification'><i className='fab fa-github' /> 신청하기</Button>
			</div>
		</Docs>
	)
}

interface VerificationProps {
	content: string
}

export const getStaticProps: GetStaticProps<VerificationProps> = async () => {
	const res = await fetch(SpecialEndPoints.Github.Content('koreanbots', 'verification', 'README.md'))
	const json = await res.json()
	return {
		props: {
			content: Buffer.from(json.content, 'base64').toString('utf-8')
		}
	}
}

export default Verification
