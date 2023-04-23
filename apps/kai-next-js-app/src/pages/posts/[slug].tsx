import type { GetStaticProps, GetStaticPaths } from 'next'
import type { RouteProps } from '~/pages/_app'
import { Meta } from '~/components/Meta'
import { PostPage } from '~/components/PostPage'
import type { PostPageProps } from '~/components/PostPage'
import { createKontentApi } from '~/lib/kontent/delivery-client'
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

  const kontentApi = createKontentApi(preview)

  // Get the post

  const postsWithSlugResult = await kontentApi.fetchItems((client) =>
    createPostsWithSlugQuery(client, slug)
  )

  if (postsWithSlugResult.error) {
    // TODO: Deal with this error -> 500
    throw new Error(postsWithSlugResult.error.message)
  }

  if (!postsWithSlugResult.items) {
    // TODO: Deal with this error -> 404
    return {
      notFound: true
    }
  }

  if (postsWithSlugResult.items.length > 1) {
    // TODO: Deal with this error -> 500
    throw new Error(`There is more than post with the slug '${slug}'.`)
  }

  const post = postsWithSlugResult.items[0]

  // Get more posts

  const morePostsForSlugResult = await kontentApi.fetchItems((client) =>
    createMorePostsForSlugQuery(client, slug)
  )

  // Map response data and return props

  return {
    props: {
      meta: createMetaProps(post),
      layout: createLayoutProps(preview),
      page: createPostPageProps(post, morePostsForSlugResult.items)
    },
    revalidate: 600
  }
}

export const getStaticPaths: GetStaticPaths<PostRouteParams> = async () => {
  const kontentApi = createKontentApi()

  const allPostsSlugsResult = await kontentApi.fetchItems(
    createAllPostsSlugsQuery
  )

  if (allPostsSlugsResult.error) {
    // TODO: Deal with this error -> 500
    throw new Error(allPostsSlugsResult.error.message)
  }

  const slugs = allPostsSlugsResult.items.map(
    (item) => item.elements.slug.value
  )

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
