import Head from 'next/head'

interface MetaProps {
  title: string
  description?: string | null
  openGraph: {
    type: string
    title: string
    description?: string | null
    image?: string | null
  }
}

function Meta({ title, description, openGraph }: MetaProps) {
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#000000"
      />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />

      <title>{title}</title>
      {description && <meta name="description" content={description} />}

      <meta property="og:type" content={openGraph.type} />
      <meta property="og:title" content={openGraph.title} />
      {openGraph.description && (
        <meta property="og:description" content={openGraph.description} />
      )}
      {openGraph.image && (
        <meta property="og:image" content={openGraph.image} />
      )}
    </Head>
  )
}

export { Meta }

export type { MetaProps }
