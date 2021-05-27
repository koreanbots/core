import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { SpecialEndPoints } from '@utils/Constants'


const Docs = dynamic(()=> import('@components/Docs'))
const Markdown = dynamic(() => import('@components/Markdown'))


const Guidelines: NextPage<GuidelinesProps> = ({ content }) => {
	return (
		<Docs
			header='가이드라인'
			description='리스트에 등재되는 모든 봇들이 지켜야하는 가이드라인입니다!'
		>
			<Markdown text={content} />
		</Docs>
	)
}

interface GuidelinesProps {
	content: string
}

export const getStaticProps: GetStaticProps<GuidelinesProps> = async () => {
	const res = await fetch(SpecialEndPoints.Github.Content('koreanbots', 'terms', 'guidelines.md'))
	const json = await res.json()
	return {
		props: {
			content: Buffer.from(json.content, 'base64').toString('utf-8')
		}
	}
}

export default Guidelines

