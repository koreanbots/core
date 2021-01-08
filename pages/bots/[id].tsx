import { NextPage, NextPageContext } from 'next'
import { SnowflakeUtil } from 'discord.js'
import Day from '../../utils/Day'
import { ParsedUrlQuery } from 'querystring'

import Container from '../../components/Container'
import DiscordImage from '../../components/DiscordImage'
import Divider from '../../components/Divider'
import Tag from '../../components/Tag'
import Owner from '../../components/Owner'
import Segment from '../../components/Segment'
import { Bot, User } from '../../types'
import NotFound from '../404'
import SEO from '../../components/SEO'
import LongButton from '../../components/LongButton'
import { Status } from '../../utils/Constants'
import { Fetch, formatNumber } from '../../utils'
import Advertisement from '../../components/Advertisement'

const Bots:NextPage<BotsProps> = ({ data, date, votes}) => {
	console.log(data)
	if(!data.id) return <NotFound />
	return <Container paddingTop className='py-10'>
		<SEO title={data.name} description={data.intro} image={data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=1024` : `https://cdn.discordapp.com/embed/avatars/${Number(data.tag) % 5}.png?size=1024`} />
		<div className='lg:flex'>
			<div className='w-full lg:w-1/4 text-center'>
				<DiscordImage userID={data.id} avatarHash={data.avatar} tag={data.tag} className='w-full'/>
			</div>
			<div className='py-12 px-5 w-full text-center lg:text-left flex-grow lg:w-5/12'>
				<div>
					<Tag circular text={(<><i className={`fas fa-circle text-${Status[data.status]?.color}`}/> {Status[data.status]?.text}</>)}/>
					<h1 className='text-4xl font-bold mb-2 mt-3'>{data.name} {data.trusted && <span className='text-koreanbots-blue text-3xl'><i className='fas fa-award' /></span>}</h1>
				</div>
				<p className='text-base text-gray-800 dark:text-gray-300'>{data.intro}</p>
			</div>
			<div className='w-full lg:w-1/4'>
				<LongButton href={data.url || `https://discordapp.com/oauth2/authorize?client_id=${data.id}&scope=bot&permissions=0`}>
					<h4 className="whitespace-nowrap"><i className="fas fa-user-plus" /> 초대하기</h4>
				</LongButton>
				<LongButton>

					<h4><i className='far fa-heart text-pink-600' /> 하트 추가</h4>
					<span className='text-sm bg-little-white-hover dark:bg-very-black text-black dark:text-gray-400 px-2 py-1 rounded-lg ml-1 text-center'>{votes}</span>
	
				</LongButton>
			</div>
		
			
		</div>
		<Divider className='px-5' />
		<div className='lg:flex lg:flex-row-reverse'>
			<div className='w-full lg:w-1/4 mb-1'>
				<h2 className='3xl font-bold mb-2'>정보</h2>
				<div className='grid grid-cols-2 gap-4 bg-little-white dark:bg-discord-black text-black dark:text-gray-400 px-4 py-4'>
					<div><i className="far fa-flag" /> 접두사</div>
					<div>{data.prefix}</div>
					<div><i className="fas fa-users" /> 서버수</div>
					<div>{data.servers}</div>
					<div><i className="fas fa-calendar-day" /> 봇 생성일</div>
					<div>{Day(date).fromNow(false)}</div>
					<div><i className='fas fa-check text-discord-blurple' /> 디스코드 인증됨</div>

				</div>
				<h2 className='3xl font-bold mt-2 mb-2'>카테고리</h2>
				<div className='flex flex-wrap'>
					{ data.category.map(el=> <Tag key={el} text={el} href={`/categories/${el}`} /> ) }
				</div>
				<h2 className='3xl font-bold mt-2 mb-2'>제작자</h2>
				{ (data.owners as User[]).map(el=> <Owner key={el.id} id={el.id} tag={el.tag} avatarHash={el.avatar} username={el.username} /> ) }
				<Advertisement />
			</div>
			<div className='markdown-body w-full lg:w-3/4 lg:pr-5 pt-10'>
				<Advertisement />
				<Segment>
					<h1>이 메세지는 테스트 메세지입니다.</h1>
					<h2>아이유 짱</h2>
					<code>yee</code><br/><br/>
					<pre>멋진 코드블럭</pre>
					<hr />

					<table>
						<th>foo</th>
						<th>bar</th>
						<tbody>
							<td>pizza</td>
							<td>apple</td>
						</tbody>
					</table>
					<ul className='list-disc'>
						<li>first</li>
						<li>second</li>
					</ul>

					<ul className='list-decimal'>
						<li>first</li>
						<li>second</li>
					</ul>
				</Segment>
				<Advertisement />
			</div>
			
		</div>
	</Container>
}

export const getServerSideProps = async (ctx: Context) => {
	const data = await Fetch.bot.load(ctx.query.id)
	return { props: { data, date: SnowflakeUtil.deconstruct(data.id ?? '0').date.toJSON(), votes: formatNumber(data.votes ??  0, 3) } }
}

export default Bots

interface BotsProps {
  data: Bot
  date: Date
  votes: string
}
interface Context extends NextPageContext {
  query: Query
}

interface Query extends ParsedUrlQuery {
  id: string
}