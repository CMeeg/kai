import type { Contracts } from '@kontent-ai/delivery-sdk'
import { elementTypeName } from './element'

interface CreateUrlSlugElementOptions {
  name: string
  urlSlug: string | null
}

function createUrlSlugElement(
  options: CreateUrlSlugElementOptions
): Contracts.IElementContract {
  return {
    type: elementTypeName.urlSlug,
    name: options.name,
    value: options.urlSlug || ''
  }
}

export { createUrlSlugElement }

export type { CreateUrlSlugElementOptions }
