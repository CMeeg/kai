import type { GetStaticProps } from 'next'
import type { RouteProps } from './_app'
import { Meta } from '~/components/Meta'
import { createLayoutProps } from '~/components/Layout'
import { HomePage, createHomePageProps } from '~/components/HomePage'
import type { HomePageProps } from '~/components/HomePage'
import { createDeliveryClient } from '~/lib/kontent/delivery-client'
import { createPostsApi } from '~/lib/posts'

type HomeRouteProps = RouteProps<HomePageProps>

export default function HomeRoute({ meta, page }: HomeRouteProps) {
  return (
    <>
      <Meta title={meta.title} />
      <HomePage heroPost={page.heroPost} morePosts={page.morePosts} />
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeRouteProps> = async ({
  preview = false
}) => {
  const deliveryClient = createDeliveryClient(preview)
  const postsResponse = await createPostsApi(deliveryClient).getPosts()

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
