import type { Elements, IContentItem } from '@kontent-ai/delivery-sdk'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import { hastToKast } from './hast-kast'
import type { KastRoot } from './kast'

interface RichTextKastResolver {
  resolveRichText: (input: RichTextKastResolverInput) => Promise<KastRoot>
}

interface RichTextKastResolverInput {
  element: Elements.RichTextElement
  linkedItems?: IContentItem[]
}

function createRichTextKastResolver(): RichTextKastResolver {
  return {
    resolveRichText: async ({ element, linkedItems }) => {
      const hast = await unified()
        .use(rehypeParse, { fragment: true })
        .parse(element.value)

      return await unified().use(hastToKast).run(hast)
    }
  }
}

export { createRichTextKastResolver }

export type { RichTextKastResolver, RichTextKastResolverInput }
