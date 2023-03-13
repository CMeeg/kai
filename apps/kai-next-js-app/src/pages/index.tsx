import Head from 'next/head'
import type { GetStaticProps } from 'next'
import Layout from '~/components/Layout'
import Container from '~/components/Container'

interface HomeRouteProps {
  preview: boolean
}

export default function HomeRoute({ preview }: HomeRouteProps) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Next.js Blog Example with Kontent.ai</title>
      </Head>
      <Container>TODO</Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<HomeRouteProps> = async ({
  preview = false
}) => {
  return {
    props: { preview }
  }
}
