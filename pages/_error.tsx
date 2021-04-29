/* https://github.com/vercel/next.js/blob/canary/examples/with-sentry/pages/_error.js */

import { NextPageContext } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import NextErrorComponent, { ErrorProps } from 'next/error'
import * as Sentry from '@sentry/react'
import { getRandom } from '@utils/Tools'
import { ErrorMessage } from '@utils/Constants'

const Container = dynamic(() => import('@components/Container'))

const MyError = () => {
	return <div
		className='flex items-center h-screen select-none px-20'
	>
		<Container>
			<h2 className='text-4xl font-semibold'>{getRandom(ErrorMessage)}</h2>
			<p className='text-md mt-1'>예상치 못한 오류가 발생하였습니다. 문제가 지속적으로 발생한다면 문의해주세요!</p>
			<a className='text-sm text-blue-500 hover:text-blue-400' href='https://status.koreanbots.dev' target='_blank' rel='noreferrer'>상태 페이지</a>
			<div>
				<Link href='/discord'>
					<a target='_blank' rel='noreferrer' className='text-lg hover:opacity-80 cursor-pointer'>
						<i className='fab fa-discord' />
					</a>
				</Link>
				<a href='https://twitter.com/koreanbots' target='_blank' rel='noreferrer' className='text-lg ml-2 hover:opacity-80 cursor-pointer'>
					<i className='fab fa-twitter' />
				</a>
			</div>
		</Container>
	</div>
}

MyError.getInitialProps = async ({ res, err, asPath, pathname, query, AppTree }:NextPageContext) => {
	const errorInitialProps:CustomErrorProps = await NextErrorComponent.getInitialProps({ err, res, pathname, asPath, query, AppTree })

	// Workaround for https://github.com/vercel/next.js/issues/8592, mark when
	// getInitialProps has run
	errorInitialProps.hasGetInitialPropsRun = true

	// Running on the server, the response object (`res`) is available.
	//
	// Next.js will pass an err on the server if a page's data fetching methods
	// threw or returned a Promise that rejected
	//
	// Running on the client (browser), Next.js will provide an err if:
	//
	//  - a page's `getInitialProps` threw or returned a Promise that rejected
	//  - an exception was thrown somewhere in the React lifecycle (render,
	//    componentDidMount, etc) that was caught by Next.js's React Error
	//    Boundary. Read more about what types of exceptions are caught by Error
	//    Boundaries: https://reactjs.org/docs/error-boundaries.html

	if (err) {
		Sentry.captureException(err)

		// Flushing before returning is necessary if deploying to Vercel, see
		// https://vercel.com/docs/platform/limits#streaming-responses
		await Sentry.flush(2000)

		return errorInitialProps
	}

	// If this point is reached, getInitialProps was called without any
	// information about what the error might be. This is unexpected and may
	// indicate a bug introduced in Next.js, so record it in Sentry
	Sentry.captureException(
		new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
	)
	await Sentry.flush(2000)

	return { err }
}

interface CustomErrorProps extends ErrorProps {
	hasGetInitialPropsRun?: boolean	
}

export default MyError