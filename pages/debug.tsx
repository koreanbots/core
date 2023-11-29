import dynamic from 'next/dynamic'
import { useFormik } from 'formik'

const Container = dynamic(() => import('@components/Container'))
const Divider = dynamic(() => import('@components/Divider'))
const Segment = dynamic(() => import('@components/Segment'))

import Package from '../package.json'
import Markdown from '@components/Markdown'
import { parseDockerhubTag } from '@utils/Tools'

const ClientInfo = (): JSX.Element => {
	const formik = useFormik({
		initialValues: {
			markdown: `<div align="center">
<h1>Hello, World</h1>
</div>
<kbd>X</kbd>키를 눌러 Joy를 표하세요.
\`\`\`
코드 블럭
\`\`\`

*도* **레** ***미*** __***파***__

[트위터](https://twitter.com/koreanbots)
https://github.com/koreanbots
`,
		},
		onSubmit: () => {
			alert('Pong')
		},
	})
	return (
		<Container paddingTop className='pb-10'>
			<h1 className='mb-3 mt-3 text-4xl font-bold'>개발자모드</h1>
			<h2 className='mb-4 text-3xl font-semibold'>정보들</h2>
			<Segment>
				<div className='markdown-body text-black dark:text-white'>
					<h1>빌드정보</h1>
					<ul className='list-disc'>
						<li>
							Tag: <code>{parseDockerhubTag(process.env.NEXT_PUBLIC_TAG)}</code>
						</li>
						<li>
							Version: <code>v{Package.version}</code>
						</li>
						<li>
							Hash: <code>{process.env.NEXT_PUBLIC_SOURCE_COMMIT}</code>
						</li>
					</ul>
				</div>
			</Segment>
			<Divider />
			<h2 className='mb-2 text-3xl font-semibold'>테스트</h2>
			<h3 className='mb-2 text-2xl font-semibold'>마크다운</h3>
			<Segment>
				<div className='lg:flex'>
					<div className='min-h-48 w-full lg:w-1/2'>
						<textarea
							className='h-full w-full resize-none p-5 outline-none dark:bg-discord-dark'
							name='markdown'
							value={formik.values.markdown}
							onChange={formik.handleChange}
						/>
					</div>
					<div className='w-full p-10 lg:w-1/2'>
						<Markdown text={formik.values.markdown} />
					</div>
				</div>
			</Segment>
		</Container>
	)
}

export default ClientInfo
