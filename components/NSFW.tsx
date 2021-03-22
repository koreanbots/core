import dynamic from 'next/dynamic'

const Button = dynamic(() => import('@components/Button'))
const Container = dynamic(() => import('@components/Container'))

const NSFW = ({ onClick, onDisableClick }:NSFWProps): JSX.Element => {
	return <Container>
		<div className='flex items-center h-screen select-none'>
			<div className='px-10'>
				<h1 className='text-2xl font-bold flex'>
					<img draggable='false' alt='⚠' src='https://twemoji.maxcdn.com/v/13.0.2/svg/26a0.svg' className='emoji mr-2 w-8' />
          해당 컨텐츠는 만19세 이상의 성인만 열람할 수 있습니다.</h1>
				<p className='text-lg mb-3'>계속하시겠습니까?</p>
				<Button onClick={onClick}>
					<i className='fas fa-arrow-right' />  계속하기
				</Button>
				<div className='mt-1'>
					<button className='text-blue-500 hover:text-blue-600' onClick={() => {
						onClick()
						onDisableClick()
					}}>다시 표시하지 않기.</button>
				</div>
			</div>
		</div>
	</Container>
}

interface NSFWProps {
  onClick(): void
  onDisableClick(): void
}

export default NSFW