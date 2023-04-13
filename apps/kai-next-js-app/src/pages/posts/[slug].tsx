import type { GetStaticProps, GetStaticPaths } from 'next'
import type { RouteProps } from '~/pages/_app'
import { Meta } from '~/components/Meta'
import { PostPage } from '~/components/PostPage'
import type { PostPageProps } from '~/components/PostPage'
import {
  createDeliveryClient,
  fetchContentItems
} from '~/lib/kontent/delivery-client'
import { createMetaProps } from '~/lib/seo'
import { createLayoutProps } from '~/lib/layout'
import {
  createPostsWithSlugQuery,
  createMorePostsForSlugQuery,
  createAllPostsSlugsQuery,
  createPostPageProps
} from '~/lib/posts'

type PostRouteProps = RouteProps<PostPageProps>

export default function PostRoute({ meta, page }: PostRouteProps) {
  return (
    <>
      <Meta
        title={meta.title}
        description={meta.description}
        openGraph={meta.openGraph}
      />

      <PostPage post={page.post} morePosts={page.morePosts} />
    </>
  )
}

type PostRouteParams = {
  slug: string
}

export const getStaticProps: GetStaticProps<
  PostRouteProps,
  PostRouteParams
> = async ({ params, preview = false }) => {
  // Validate params

  const slug = params?.slug

  if (!slug) {
    // TODO: Deal with this error -> 500
    throw new Error(`'slug' param not provided.`)
  }

  // Get the post

  const deliveryClient = createDeliveryClient(preview)
  const postsWithSlugQuery = createPostsWithSlugQuery(deliveryClient, slug)
  const postsResponse = await fetchContentItems(postsWithSlugQuery)

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

  if (postsResponse.items.length > 1) {
    // TODO: Deal with this error -> 500
    throw new Error(`There is more than post with the slug '${slug}'.`)
  }

  const post = postsResponse.items[0]

  // Get more posts

  const morePostsQuery = createMorePostsForSlugQuery(deliveryClient, slug)
  const morePostsResponse = await fetchContentItems(morePostsQuery)

  // Map response data and return props

  return {
    props: {
      meta: createMetaProps(post),
      layout: createLayoutProps(preview),
      page: createPostPageProps(post, morePostsResponse.items)
    },
    revalidate: 600
  }
}

export const getStaticPaths: GetStaticPaths<PostRouteParams> = async () => {
  const deliveryClient = createDeliveryClient()
  const slugsQuery = createAllPostsSlugsQuery(deliveryClient)
  const slugsResponse = await fetchContentItems(slugsQuery)

  if (slugsResponse.error) {
    // TODO: Deal with this error -> 500
    throw new Error(slugsResponse.error.message)
  }

  const slugs = slugsResponse.items.map((item) => item.elements.slug.value)

  return {
    paths: slugs.map((slug) => {
      return {
        params: {
          slug
        }
      }
    }),
    fallback: 'blocking'
  }
}
