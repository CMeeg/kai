import type { Contracts } from '@kontent-ai/delivery-sdk'
import { elementTypeName } from './element'

interface CreateDateTimeElementOptions {
  name: string
  dateTime: Date | null
  displayTimezone?: string | null
}

function createDateTimeElement(
  options: CreateDateTimeElementOptions
): Contracts.IDateTimeElementContract {
  const date = options.dateTime ? options.dateTime.toJSON() : null

  return {
    type: elementTypeName.dateTime,
    name: options.name,
    value: date,
    // TODO: According to the docs this should accept null, but the Contract doesn't allow null
    display_timezone: options?.displayTimezone ?? ''
  }
}

export { createDateTimeElement }

export type { CreateDateTimeElementOptions }
