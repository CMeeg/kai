import type { GetStaticProps, GetStaticPaths } from 'next'
import type { RouteProps } from '~/pages/_app'
import { Meta } from '~/components/Meta'
import { createLayoutProps } from '~/components/Layout'
import { PostPage, createPostPageProps } from '~/components/PostPage'
import type { PostPageProps } from '~/components/PostPage'
import {
  createDeliveryClient,
  fetchContentItems
} from '~/lib/kontent/delivery-client'
import {
  createPostsWithSlugQuery,
  createMorePostsForSlugQuery,
  createAllPostsSlugsQuery
} from '~/lib/posts'

type PostRouteProps = RouteProps<PostPageProps>

export default function PostRoute({ meta, page }: PostRouteProps) {
  return (
    <>
      <Meta title={meta.title} image={meta.image} />
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
      // TODO: Create metadata snippet and get metadata from Kontent
      meta: {
        title: `${post.elements.title.value} | Next.js Blog Example with Kontent.ai`,
        image: post.elements.cover_image.value[0]?.url ?? null
      },
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
