import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { lstat, readdir, readFile } from 'fs/promises'
import { join } from 'path'

import { DocsData } from '@types'

import NotFound from 'pages/404'
import Message from '@components/Message'

const DeveloperLayout = dynamic(() => import('@components/DeveloperLayout'))
const Markdown = dynamic(() => import ('@components/Markdown'))

const docsDir = './api-docs/docs'
const Docs: NextPage<DocsProps> = ({ docs }) => {
	const router = useRouter()
	const [ document, setDoc ] = useState<DocsData>(null)
	useEffect(() => {
		if(!router.query.first) return
		let res = docs?.find(el => el.name === router.query.first)
		if(router.query.second) res = res?.list?.find(el => el.name === router.query.second)
		setDoc(res || { name: 'Not Found' })
		setTimeout(highlightBlocks, 100)
	}, [docs, router.query])

	useEffect(() => highlightBlocks, [document])
	if(document?.name === 'Not Found') return <NotFound />
	return <DeveloperLayout enabled='docs' docs={docs} currentDoc={(router.query.second || router.query.first) as string}>
		<div className='px-2'>
			{
				!document ? ''
					: <Markdown text={document.text} options={{ openLinksInNewWindow: false }} components={{ message: Message, code }} allowedTag={['message']} />
			}
		</div>
	</DeveloperLayout>
}

export async function getStaticPaths () {
	return {
		paths: [],
		fallback: true
	}
}

export async function getStaticProps () {
	const docs = await Promise.all((await readdir(docsDir)).map(async el => {
		const isDir = (await lstat(join(docsDir, el))).isDirectory()
		if(!isDir) {
			return {
				name: el.split('.').slice(0, -1).join('.'),
				text: (await readFile(join(docsDir, el))).toString()
			}
		}
		else {
			return {
				name: el,
				list: await Promise.all((await readdir(join(docsDir, el))).map(async e => {
					return {
						name: e.split('.').slice(0, -1).join('.'),
						text: (await readFile(join(docsDir, el, e))).toString()
					}
				}))
			}
		}
		
	}))

	return {
		props: { docs }
	}
}

function code({ children }:{ children: string }):JSX.Element {
	const methods = {
		get: 'text-green-400',
		post: 'text-yellow-400',
		put: 'text-blue-500',
		patch: 'text-yellow-400',
		delete: 'text-red-500'
	}
	return <code className={`${methods[String(children).toLowerCase()]}`}>
		{children}
	</code>
}
function highlightBlocks() {
	const nodes = window.document.querySelectorAll('pre code')
	nodes.forEach(el => {
		window.hljs.highlightBlock(el)
	})
}
interface DocsProps {
  docs: DocsData[]
}

export default Docs