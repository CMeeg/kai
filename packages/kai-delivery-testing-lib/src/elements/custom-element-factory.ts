import type { Contracts } from '@kontent-ai/delivery-sdk'
import { elementTypeName } from './element'

interface CreateCustomElementOptions {
  name: string
  value: string | null
}

function createCustomElement(
  options: CreateCustomElementOptions
): Contracts.IElementContract {
  return {
    type: elementTypeName.custom,
    name: options.name,
    value: options.value
  }
}

export { createCustomElement }

export type { CreateCustomElementOptions }
