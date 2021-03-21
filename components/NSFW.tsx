import dynamic from 'next/dynamic'

const Button = dynamic(() => import('@components/Button'))
const Container = dynamic(() => import('@components/Container'))

const NSFW = ({ onClick }:NSFWProps): JSX.Element => {
	return <Container>
		<div className='flex items-center h-screen select-none'>
			<div className='px-10'>
				<h1 className='text-2xl font-bold'>해당 컨텐츠는 만19세 이상의 성인만 열람할 수 있습니다.</h1>
				<p className='text-lg mb-3'>계속하시겠습니까?</p>
				<Button onClick={onClick}>
					<i className='fas fa-arrow-right' />  계속하기
				</Button>
			</div>
		</div>
	</Container>
}

interface NSFWProps {
  onClick(): void
}

export default NSFW