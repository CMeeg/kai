import type { GetStaticProps } from 'next'
import type { RouteProps } from './_app'
import { Meta } from '~/components/Meta'
import { createLayoutContentProps } from '~/components/Layout'
import { HomePage, createHomePageContentProps } from '~/components/HomePage'
import type { HomePageContentProps } from '~/components/HomePage'
import { createDeliveryClient } from '~/lib/kontent/delivery-client'
import { createPostsApi } from '~/lib/posts'

type HomeRouteProps = RouteProps<HomePageContentProps>

export default function HomeRoute({ meta, page }: HomeRouteProps) {
  return (
    <>
      <Meta title={meta.title} />
      <HomePage heroPost={page.heroPost} />
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
      layout: createLayoutContentProps(preview),
      page: createHomePageContentProps(postsResponse.items)
    },
    revalidate: 600
  }
}
