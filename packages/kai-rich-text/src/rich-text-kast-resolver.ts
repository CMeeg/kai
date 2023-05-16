import type { Elements, IContentItemsContainer } from '@kontent-ai/delivery-sdk'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import { hastToKast } from './hast-kast'
import type { KastRoot, KastInternalUrlResolver } from './kast'

interface RichTextKastResolver {
  resolveRichText: (input: RichTextKastResolverInput) => Promise<KastRoot>
}

interface RichTextKastResolverOptions {
  urlResolver?: KastInternalUrlResolver
}

interface RichTextKastResolverInput {
  element: Elements.RichTextElement
  linkedItems?: IContentItemsContainer
}

function createRichTextKastResolver(
  options?: RichTextKastResolverOptions
): RichTextKastResolver {
  return {
    resolveRichText: async ({ element, linkedItems }) => {
      const hast = await unified()
        .use(rehypeParse, { fragment: true })
        .parse(element.value)

      /*
      TODO: Extend hastToKast so that it will add more data to certain elements such as:
      * component or item data for components (https://kontent.ai/learn/reference/openapi/delivery-api/#section/Content-items-and-components-in-rich-text)
      * Add a strategy for rewriting Asset URLs?
      */

      return await unified()
        .use(rehypeMinifyWhitespace)
        .use(hastToKast, {
          element,
          linkedItems,
          urlResolver: options?.urlResolver
        })
        .run(hast)
    }
  }
}

export { createRichTextKastResolver }

export type { RichTextKastResolver, RichTextKastResolverInput }
