import type { Contracts } from '@kontent-ai/delivery-sdk'
import { elementTypeName } from './element'

interface CreateNumberElementOptions {
  name: string
  number: number | null
}

function createNumberElement(
  options: CreateNumberElementOptions
): Contracts.IElementContract {
  return {
    type: elementTypeName.number,
    name: options.name,
    value: options.number || null
  }
}

export { createNumberElement }

export type { CreateNumberElementOptions }
