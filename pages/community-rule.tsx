import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { getGithubContent } from '@utils/GithubContent'

const Docs = dynamic(() => import('@components/Docs'))
const Markdown = dynamic(() => import('@components/Markdown'))

const CommunityRule: NextPage<CommunityRuleProps> = ({ content }) => {
	return (
		<Docs header='커뮤니티 규칙' description='한국 디스코드 리스트 커뮤니티 규칙입니다.'>
			<Markdown text={content} />
		</Docs>
	)
}

interface CommunityRuleProps {
	content: string
}

export const getStaticProps: GetStaticProps<CommunityRuleProps> = async () => {
	return {
		props: {
			content: await getGithubContent('terms', 'community-rule.md'),
		},
	}
}

export default CommunityRule
