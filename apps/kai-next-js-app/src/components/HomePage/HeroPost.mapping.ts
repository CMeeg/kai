import type { AuthorContentItem, PostContentItem } from '~/lib/kontent/models'
import type { Author } from '~/lib/posts'
import type { HeroPostProps } from './HeroPost'

function createAuthor(author: AuthorContentItem): Author {
  return {
    name: author.elements.name.value,
    picture: author.elements.picture.value[0].url
  }
}

function createHeroPostProps(post: PostContentItem): HeroPostProps {
  return {
    post: {
      title: post.elements.title.value,
      // TODO: Model gen issue here...
      coverImage: post.elements.cover_image.value[0].url,
      date: post.elements.date.value,
      excerpt: post.elements.excerpt.value,
      author: createAuthor(post.elements.author.linkedItems[0]),
      slug: post.elements.slug.value
    }
  }
}

export { createHeroPostProps }
