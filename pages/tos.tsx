import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { SpecialEndPoints } from '@utils/Constants'


const Docs = dynamic(()=> import('@components/Docs'))
const Markdown = dynamic(() => import('@components/Markdown'))


const ToS: NextPage<ToSProps> = ({ content }) => {
	return (
		<Docs
			header='서비스 이용약관'
			description='한국 디스코드봇 리스트의 서비스를 이용하실 때 지켜야하는 약관입니다.'
		>
			<Markdown text={content} />
		</Docs>
	)
}

interface ToSProps {
	content: string
}

export const getStaticProps: GetStaticProps<ToSProps> = async () => {
	const res = await fetch(SpecialEndPoints.Github.Content('koreanbots', 'terms', 'tos.md'))
	const json = await res.json()
	return {
		props: {
			content: Buffer.from(json.content, 'base64').toString('utf-8')
		}
	}
}

export default ToS

