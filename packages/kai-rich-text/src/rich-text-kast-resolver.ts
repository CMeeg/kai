import type { Elements, IContentItem } from '@kontent-ai/delivery-sdk'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
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

      /*
      TODO: Extend hastToKast so that it will add more data to certain elements such as:
      * url for internal links (https://kontent.ai/learn/reference/openapi/delivery-api/#section/Links-in-rich-text)
      * component or item data for components (https://kontent.ai/learn/reference/openapi/delivery-api/#section/Content-items-and-components-in-rich-text)
      */

      return await unified()
        .use(rehypeMinifyWhitespace)
        .use(hastToKast, { element })
        .run(hast)
    }
  }
}

export { createRichTextKastResolver }

export type { RichTextKastResolver, RichTextKastResolverInput }
