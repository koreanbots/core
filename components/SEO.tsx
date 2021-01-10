import Head from 'next/head'

const SEO = ({ title, description, image }: SEOProps): JSX.Element => {
	return (
		<Head>
			<title>{title} - 한국 디스코드봇 리스트</title>
			{description && <meta name='description' content={description} />}
			<meta name='og:site_name' content='한국 디스코드봇 리스트' />
			<meta name='og:title' content={title} />
			{description && <meta name='og:description' content={description} />}
			{image && <meta name='og:image' content={image} />}
		</Head>
	)
}

export default SEO

interface SEOProps {
	title: string
	description?: string
	image?: string
}
