import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import fetch from 'node-fetch'

import { SpecialEndPoints } from '@utils/Constants'

const Docs = dynamic(()=> import('@components/Docs'))
const Markdown = dynamic(() => import('@components/Markdown'))

const Privacy: NextPage<PrivacyProps> = ({ content }) => {
	return (
		<Docs header='개인정보취급방침' description='저희가 개인정보를 취급하는 방침입니다.'>
			<Markdown text={content} />
		</Docs>
	)
}

export const getStaticProps: GetStaticProps<PrivacyProps> = async () => {
	const res = await fetch(SpecialEndPoints.Github.Content('koreanbots', 'terms', 'privacy-policy.md'))
	const json = await res.json()
	return {
		props: {
			content: Buffer.from(json.content, 'base64').toString('utf-8')
		}
	}
}

interface PrivacyProps {
	content: string
}

export default Privacy