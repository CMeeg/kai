import type { KaiContentItem } from '@meeg/kai-delivery'
import type { AuthorContentItem, PostContentItem } from '~/lib/kontent/models'
import { createImageFromAsset } from '~/lib/media'
import type { ImageAsset } from '~/lib/media'
import type { PostPageProps } from '~/components/PostPage'

interface Author {
  name: string
  picture: ImageAsset
}

interface Post {
  title: string
  url: string | null
  date: string | null
  content: string
  excerpt: string
  coverImage: ImageAsset | null
  author: Author | null
}

type PostSummary = Omit<Post, 'content'>

function createAuthor(contentItem: AuthorContentItem): Author | null {
  const picture = createImageFromAsset(contentItem.elements.picture.value[0])

  if (!picture) {
    return null
  }

  return {
    name: contentItem.elements.name.value,
    picture
  }
}

function createPost(contentItem: KaiContentItem<PostContentItem>): Post {
  return {
    title: contentItem.elements.title.value,
    url: contentItem.kai.url || null,
    date: contentItem.elements.date.value,
    content: contentItem.elements.content.value,
    excerpt: contentItem.elements.excerpt.value,
    coverImage: createImageFromAsset(contentItem.elements.cover_image.value[0]),
    author: createAuthor(contentItem.elements.author.linkedItems[0])
  }
}

function createPostSummary(
  contentItem: KaiContentItem<PostContentItem>
): PostSummary {
  return {
    title: contentItem.elements.title.value,
    url: contentItem.kai.url || null,
    date: contentItem.elements.date.value,
    excerpt: contentItem.elements.excerpt.value,
    coverImage: createImageFromAsset(contentItem.elements.cover_image.value[0]),
    author: createAuthor(contentItem.elements.author.linkedItems[0])
  }
}

function createPostPageProps(
  postItem: KaiContentItem<PostContentItem>,
  morePostsItems: KaiContentItem<PostContentItem>[]
): PostPageProps {
  return {
    post: createPost(postItem),
    morePosts: morePostsItems.map((post) => createPostSummary(post))
  }
}

export { createPost, createPostSummary, createPostPageProps }

export type { Author, Post, PostSummary }
