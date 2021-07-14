import dynamic from 'next/dynamic'
import { useFormik } from 'formik'

const Container = dynamic(()=> import('@components/Container'))
const Divider = dynamic(()=> import('@components/Divider'))
const Segment = dynamic(()=> import('@components/Segment'))

import Package from '../package.json'
import Markdown from '@components/Markdown'
import { parseDockerhubTag } from '@utils/Tools'

const ClientInfo = ():JSX.Element => {
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
`
		},
		onSubmit: ()=>{ alert('Pong') }
	})
	return <Container paddingTop className='pb-10'>
		<h1 className='text-4xl font-bold mb-3 mt-3'>개발자모드</h1>
		<h2 className='text-3xl font-semibold mb-4'>정보들</h2>
		<Segment>
			<div className='markdown-body text-black dark:text-white'>
				<h1>빌드정보</h1>
				<ul className='list-disc'>
					<li>Tag: <code>{parseDockerhubTag(process.env.NEXT_PUBLIC_TAG)}</code></li>
					<li>Version: <code>v{Package.version}</code></li>
					<li>Hash: <code>{process.env.NEXT_PUBLIC_SOURCE_COMMIT}</code></li>
				</ul>

			</div>
		</Segment>
		<Divider />
		<h2 className='text-3xl font-semibold mb-2'>테스트</h2>
		<h3 className='text-2xl font-semibold mb-2'>마크다운</h3>
		<Segment>
			<div className='lg:flex'>
				<div className='w-full lg:w-1/2 min-h-48'>
					<textarea className='resize-none w-full h-full dark:bg-discord-dark outline-none p-5' name='markdown' value={formik.values.markdown} onChange={formik.handleChange}/>
				</div>
				<div className='w-full lg:w-1/2 p-10'>
					<Markdown text={formik.values.markdown} />
				</div>
			</div>
		</Segment>
	</Container>
}

export default ClientInfo