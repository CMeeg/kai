import type { Contracts } from '@kontent-ai/delivery-sdk'
import { elementTypeName } from './element'

const richTextEmptyValue = '<p><br></p>'

interface CreateRichTextElementOptions {
  name: string
  html: string
  images: Contracts.IRichTextElementImageWrapperContract
  links: Contracts.IRichTextElementLinkWrapperContract
  modularContent: string[]
}

function createRichTextElement(
  options: CreateRichTextElementOptions
): Contracts.IRichTextElementContract {
  return {
    type: elementTypeName.richText,
    name: options.name,
    images: options.images,
    links: options.links,
    modular_content: options.modularContent,
    value: options.html || richTextEmptyValue
  }
}

export { createRichTextElement, richTextEmptyValue }

export type { CreateRichTextElementOptions }
