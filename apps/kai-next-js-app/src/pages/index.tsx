import type { GetStaticProps } from 'next'
import type { RouteProps } from '~/pages/_app'
import { Meta } from '~/components/Meta'
import { HomePage } from '~/components/HomePage'
import type { HomePageProps } from '~/components/HomePage'
import {
  createDeliveryClient,
  fetchContentItem,
  fetchContentItems
} from '~/lib/kontent/delivery-client'
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
  // Get home
  const deliveryClient = createDeliveryClient(preview)
  const homeQuery = createHomeQuery(deliveryClient)
  const homeResponse = await fetchContentItem(homeQuery)

  if (homeResponse.error) {
    // TODO: Deal with this error -> 500
    throw new Error(homeResponse.error.message)
  }

  if (!homeResponse.item) {
    // TODO: Deal with this error -> 404
    return {
      notFound: true
    }
  }

  // Get posts
  const allPostsQuery = createAllPostsQuery(deliveryClient)
  const postsResponse = await fetchContentItems(allPostsQuery)

  if (postsResponse.error) {
    // TODO: Deal with this error -> 500
    throw new Error(postsResponse.error.message)
  }

  if (!postsResponse.items) {
    // TODO: Deal with this error -> 404
    return {
      notFound: true
    }
  }

  // Map response data and return props

  return {
    props: {
      meta: createMetaProps(homeResponse.item),
      layout: createLayoutProps(preview),
      page: createHomePageProps(postsResponse.items)
    },
    revalidate: 600
  }
}
