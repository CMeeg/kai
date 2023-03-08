import type { Contracts } from '@kontent-ai/delivery-sdk'
import { elementTypeName } from './element'

function createLinkedItemsValues(items: Contracts.IViewContentItemContract[]) {
  if (!items) {
    return []
  }

  return items.map((linkedItem) => linkedItem.item.system.codename)
}

interface CreateLinkedItemsElementOptions {
  name: string
  items: Contracts.IViewContentItemContract[]
}

function createLinkedItemsElement(
  options: CreateLinkedItemsElementOptions
): Contracts.IElementContract {
  const value = createLinkedItemsValues(options.items)

  return {
    type: elementTypeName.linkedItems,
    name: options.name,
    value
  }
}

export { createLinkedItemsElement }

export type { CreateLinkedItemsElementOptions }
