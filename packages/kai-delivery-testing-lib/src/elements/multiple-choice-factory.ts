import type { Contracts } from '@kontent-ai/delivery-sdk'
import { snakeCase } from 'snake-case'
import { elementTypeName } from './element'

function createMultipleChoiceValues(options: string[]) {
  if (!options.length) {
    return []
  }

  return options.map((value: string) => {
    return {
      name: value,
      codename: snakeCase(value)
    }
  })
}

interface CreateMultipleChoiceElementOptions {
  name: string
  options: string[]
}

function createMultipleChoiceElement(
  options: CreateMultipleChoiceElementOptions
): Contracts.IElementContract {
  const value = createMultipleChoiceValues(options.options)

  return {
    type: elementTypeName.multipleChoice,
    name: options.name,
    value
  }
}

export { createMultipleChoiceElement }

export type { CreateMultipleChoiceElementOptions }
