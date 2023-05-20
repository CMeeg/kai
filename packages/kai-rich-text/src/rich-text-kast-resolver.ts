import type { Elements, IContentItemsContainer } from '@kontent-ai/delivery-sdk'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import { hastToKast } from './hast-kast'
import type {
  KastRoot,
  KastAssetUrlResolver,
  KastContentItemUrlResolver,
  KastComponentItemResolver
} from './kast'

interface RichTextKastResolver {
  resolveRichText: (input: RichTextKastResolverInput) => Promise<KastRoot>
}

interface RichTextKastResolverOptions {
  assetUrlResolver?: KastAssetUrlResolver
  contentItemUrlResolver?: KastContentItemUrlResolver
  componentItemResolver?: KastComponentItemResolver
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

      return await unified()
        .use(rehypeMinifyWhitespace)
        .use(hastToKast, {
          element,
          linkedItems,
          assetUrlResolver: options?.assetUrlResolver,
          contentItemUrlResolver: options?.contentItemUrlResolver,
          componentItemResolver: options?.componentItemResolver
        })
        .run(hast)
    }
  }
}

export { createRichTextKastResolver }

export type { RichTextKastResolver, RichTextKastResolverInput }
