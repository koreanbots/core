import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { SpecialEndPoints } from '@utils/Constants'


const Docs = dynamic(()=> import('@components/Docs'))
const Markdown = dynamic(() => import('@components/Markdown'))


const Guidelines: NextPage<GuidelinesProps> = ({ content }) => {
	return (
		<Docs
			header='커뮤니티 규칙'
			description='한국 디스코드 리스트 커뮤니티 규칙입니다.'
		>
			<Markdown text={content} />
		</Docs>
	)
}

interface GuidelinesProps {
	content: string
}

export const getStaticProps: GetStaticProps<GuidelinesProps> = async () => {
	const res = await fetch(SpecialEndPoints.Github.Content('koreanbots', 'terms', 'community-rule.md'))
	const json = await res.json()
	return {
		props: {
			content: Buffer.from(json.content, 'base64').toString('utf-8')
		}
	}
}

export default Guidelines

