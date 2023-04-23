import type { GetStaticProps } from 'next'
import type { RouteProps } from '~/pages/_app'
import { Meta } from '~/components/Meta'
import { HomePage } from '~/components/HomePage'
import type { HomePageProps } from '~/components/HomePage'
import { createKontentApi } from '~/lib/kontent/delivery-client'
import { createMetaProps } from '~/lib/seo'
import { createLayoutProps } from '~/lib/layout'
import { createHomeQuery, createHomePageProps } from '~/lib/home'
import { createAllPostsQuery } from '~/lib/posts'

type HomeRouteProps = RouteProps<HomePageProps>

export default function HomeRoute({ meta, page }: HomeRouteProps) {
  return (
    <>
      <Meta
        title={meta.title}
        description={meta.description}
        openGraph={meta.openGraph}
      />

      <HomePage posts={page.posts} />
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeRouteProps> = async ({
  preview = false
}) => {
  const kontentApi = createKontentApi(preview)

  // Get home
  const homeQueryResult = await kontentApi.fetchItem(createHomeQuery)

  if (homeQueryResult.error) {
    // TODO: Deal with this error -> 500
    throw new Error(homeQueryResult.error.message)
  }

  if (!homeQueryResult.item) {
    // TODO: Deal with this error -> 404
    return {
      notFound: true
    }
  }

  // Get posts
  const allPostsQueryResult = await kontentApi.fetchItems(createAllPostsQuery)

  if (allPostsQueryResult.error) {
    // TODO: Deal with this error -> 500
    throw new Error(allPostsQueryResult.error.message)
  }

  if (!allPostsQueryResult.items) {
    // TODO: Deal with this error -> 404
    return {
      notFound: true
    }
  }

  // Map response data and return props

  return {
    props: {
      meta: createMetaProps(homeQueryResult.item),
      layout: createLayoutProps(preview),
      page: createHomePageProps(allPostsQueryResult.items)
    },
    revalidate: 600
  }
}
