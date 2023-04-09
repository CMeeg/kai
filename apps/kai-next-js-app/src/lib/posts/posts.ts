interface Author {
  name: string
  picture: string
}

interface Post {
  title: string
  slug: string
  date: string | null
  content: string
  excerpt: string
  coverImage: string
  author: Author
}

type HeroPost = Omit<Post, 'content'>

export type { Author, Post, HeroPost }
