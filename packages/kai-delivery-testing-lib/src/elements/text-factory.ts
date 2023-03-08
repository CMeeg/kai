import type { Contracts } from '@kontent-ai/delivery-sdk'
import { elementTypeName } from './element'

interface CreateTextElementOptions {
  name: string
  text: string | null
}

function createTextElement(
  options: CreateTextElementOptions
): Contracts.IElementContract {
  return {
    type: elementTypeName.text,
    name: options.name,
    value: options.text || ''
  }
}

export { createTextElement }

export type { CreateTextElementOptions }
