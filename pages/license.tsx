import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import * as generateLicenseFile from 'generate-license-file'
import { ILicense } from 'generate-license-file/dist/models/license.interface'
import { readFileSync } from 'fs'

const Docs = dynamic(() => import('@components/Docs'))
const Segment = dynamic(() => import('@components/Segment'))
const Markdown = dynamic(() => import('@components/Markdown'))


const Opensource: NextPage<OpensourceProps> = ({ packageJson, mainLicense, license }) => {
	return <Docs title='오픈소스' header={<h1 className='font-black text-4xl'>
		<span className='text-koreanbots-blue'>한디리</span>
		<span><i className='text-red-500 fas fa-heart ml-2 mr-3' /> </span>
		<span>오픈소스</span>
	</h1>} subheader='한국 디스코드봇은 오픈소스 프로젝트이며, 다양한 오픈소스 프로젝트가 사용되었습니다.'>
		<h1 className='text-3xl font-bold'>소스코드</h1>
		<a href='https://github.com/koreanbots/koreanbots'><i className='fab fa-github'/>Github</a>
		<h2 className='text-2xl font-semibold my-2'>라이선스</h2>
		<Segment>
			<>
				<Markdown text={`
[원문](https://github.com/koreanbots/koreanbots/blob/master/LICENSE)

${mainLicense}`} />
			</>
		</Segment>

		<h1 className='text-3xl font-bold mt-6'>타 소프트웨어 라이선스</h1>
		<div>
      다음 소프트웨어들이 사용되었습니다:<br/>
			{
				Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.devDependencies)).map(el=> <span key={el}><a className='text-blue-500 hover:text-blue-400' href={`https://npmjs.org/package/${el}`}>{el}</a> </span>)
			}
			{
				license.map((el, i)=> 
					<div key={i}>
						<h2 className='text-xl font-semibold my-3'>{el.dependencies.join(', ')}</h2>
						<Segment>
							<Markdown text={el.content} />
						</Segment>
					</div>)
			}
		</div>
	</Docs>
}

interface OpensourceProps {
   mainLicense: string
   packageJson: {
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
   }
   license: ILicense[]
}

export async function getStaticProps () {
	const license = await generateLicenseFile.getProjectLicenses('./').then(license => license)

	return {
		props: {
			packageJson: require('package.json'),
			mainLicense: readFileSync('./LICENSE').toString(),
			license
		}
	}

}
export default Opensource