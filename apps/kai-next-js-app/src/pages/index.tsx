import type { GetStaticProps } from 'next'
import type { RouteProps } from '~/pages/_app'
import { Meta } from '~/components/Meta'
import { createLayoutProps } from '~/components/Layout'
import { HomePage, createHomePageProps } from '~/components/HomePage'
import type { HomePageProps } from '~/components/HomePage'
import {
  createDeliveryClient,
  fetchContentItems
} from '~/lib/kontent/delivery-client'
import { createAllPostsQuery } from '~/lib/posts'

type HomeRouteProps = RouteProps<HomePageProps>

export default function HomeRoute({ meta, page }: HomeRouteProps) {
  return (
    <>
      <Meta title={meta.title} />
      <HomePage posts={page.posts} />
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeRouteProps> = async ({
  preview = false
}) => {
  // Get posts

  const deliveryClient = createDeliveryClient(preview)
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
      // TODO: Create metadata snippet and home page content type and get metadata from Kontent
      meta: {
        title: 'Next.js Blog Example with Kontent.ai'
      },
      layout: createLayoutProps(preview),
      page: createHomePageProps(postsResponse.items)
    },
    revalidate: 600
  }
}
