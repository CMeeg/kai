import { parse as parseUriTemplate } from 'uri-template'
import type { IContentItem } from '@kontent-ai/delivery-sdk'

type ContentItemTemplateUrlParams = Record<string, unknown>

interface ContentItemTemplateUrlResolver {
  template: string
  createUrlParams?(
    contentItem: IContentItem
  ): ContentItemTemplateUrlParams | null
}

interface ContentItemResolveUrlResolver {
  resolve(contentItem: IContentItem): IContentItem
}

interface ContentItemUrlResolverOptions {
  [key: string]: ContentItemTemplateUrlResolver | ContentItemResolveUrlResolver
}

interface ContentItemUrlResolver {
  resolve(contentItem: IContentItem): string | null
}

function resolveContentItemUrlTemplate(
  templateUrlResolver: ContentItemTemplateUrlResolver,
  contentItem: IContentItem
) {
  // Try to resolve URL params

  let urlParams

  if (templateUrlResolver.createUrlParams) {
    urlParams = templateUrlResolver.createUrlParams(contentItem)

    if (!urlParams) {
      // The createUrlParams function returned a falsy value so we cannot resolve the template

      return null
    }
  }

  // Resolve the template and return the URL

  // TODO: Is this expensive (need to cache the result)?
  const uriTemplate = parseUriTemplate(templateUrlResolver.template)

  return uriTemplate.expand(urlParams || {})
}

function resolveContentItemUrl(
  contentItem: IContentItem,
  options: ContentItemUrlResolverOptions
): string | null {
  if (!contentItem) {
    return null
  }

  // Try to get a resolver for this content type

  const contentType = contentItem.system.type
  const urlResolver = options[contentType]

  if (!urlResolver) {
    // No resolver found

    return null
  }

  if ('resolve' in urlResolver) {
    // We need to resolve to another content item and recursively call this function

    const resolveContentItem = urlResolver.resolve(contentItem)

    return resolveContentItemUrl(resolveContentItem, options)
  }

  if ('template' in urlResolver) {
    // We need to resolve the provided template

    return resolveContentItemUrlTemplate(urlResolver, contentItem)
  }

  // If we get here then the urlResolver has not been defined correctly

  throw new Error(
    `URL resolver config entry for type '${contentType}' must define either a template or resolve function.`
  )
}

function contentItemUrlResolver(
  options: ContentItemUrlResolverOptions
): ContentItemUrlResolver {
  return {
    resolve: (contentItem: IContentItem) =>
      resolveContentItemUrl(contentItem, options)
  }
}

export { contentItemUrlResolver }

export type {
  ContentItemUrlResolver,
  ContentItemUrlResolverOptions,
  ContentItemTemplateUrlResolver,
  ContentItemTemplateUrlParams,
  ContentItemResolveUrlResolver
}
