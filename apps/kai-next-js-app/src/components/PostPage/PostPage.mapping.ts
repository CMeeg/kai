import type { PostContentItem } from '~/lib/kontent/models'
import type { PostPageProps } from './PostPage'
import { createPost, createPostSummary } from '~/lib/posts'

function createPostPageProps(
  postItem: PostContentItem,
  morePostsItems: PostContentItem[]
): PostPageProps {
  return {
    post: createPost(postItem),
    morePosts: morePostsItems.map((post) => createPostSummary(post))
  }
}

export { createPostPageProps }
