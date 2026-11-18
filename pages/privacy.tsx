import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { getGithubContent } from '@utils/GithubContent'

const Docs = dynamic(() => import('@components/Docs'))
const Markdown = dynamic(() => import('@components/Markdown'))

const Privacy: NextPage<PrivacyProps> = ({ content }) => {
	return (
		<Docs header='개인정보취급방침' description='저희가 개인정보를 취급하는 방침입니다.'>
			<Markdown text={content} />
		</Docs>
	)
}

export const getStaticProps: GetStaticProps<PrivacyProps> = async () => {
	return {
		props: {
			content: await getGithubContent('terms', 'privacy-policy.md'),
		},
	}
}

interface PrivacyProps {
	content: string
}

export default Privacy
