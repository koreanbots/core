import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { getGithubContent } from '@utils/GithubContent'

const Docs = dynamic(() => import('@components/Docs'))
const Markdown = dynamic(() => import('@components/Markdown'))

const ToS: NextPage<ToSProps> = ({ content }) => {
	return (
		<Docs
			header='서비스 이용약관'
			description='한국 디스코드 리스트의 서비스를 이용하실 때 지켜야하는 약관입니다.'
		>
			<Markdown text={content} />
		</Docs>
	)
}

interface ToSProps {
	content: string
}

export const getStaticProps: GetStaticProps<ToSProps> = async () => {
	return {
		props: {
			content: await getGithubContent('terms', 'tos.md'),
		},
	}
}

export default ToS
