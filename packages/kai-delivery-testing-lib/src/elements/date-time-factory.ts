import type { Contracts } from '@kontent-ai/delivery-sdk'
import { elementTypeName } from './element'

interface CreateDateTimeElementOptions {
  name: string
  dateTime: Date | null
}

function createDateTimeElement(
  options: CreateDateTimeElementOptions
): Contracts.IElementContract {
  const date = options.dateTime ? options.dateTime.toJSON() : null

  return {
    type: elementTypeName.dateTime,
    name: options.name,
    value: date
  }
}

export { createDateTimeElement }

export type { CreateDateTimeElementOptions }
