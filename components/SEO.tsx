import Head from 'next/head'

const SEO: React.FC<SEOProps> = ({ title, description, image }: SEOProps) => {
	return (
		<Head>
			<title>{title} - 한국 디스코드 리스트</title>
			{description && <meta name='description' content={description} />}
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
