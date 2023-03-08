import type { Contracts } from '@kontent-ai/delivery-sdk'
import { snakeCase } from 'snake-case'
import { elementTypeName } from './element'

function createTaxonomyValues(terms: string[]) {
  if (!terms.length) {
    return []
  }

  return terms.map((term) => {
    return {
      name: term,
      codename: snakeCase(term)
    }
  })
}

interface CreateTaxonomyElementOptions {
  name: string
  terms: string[]
  group: string
}

function createTaxonomyElement(
  options: CreateTaxonomyElementOptions
): Contracts.IElementContract {
  const value = createTaxonomyValues(options.terms)

  return {
    type: elementTypeName.taxonomy,
    name: options.name,
    taxonomy_group: options.group,
    value
  }
}

export { createTaxonomyElement }

export type { CreateTaxonomyElementOptions }
