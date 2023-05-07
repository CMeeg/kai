import type {
  Elements,
  IContentItem,
  IAsyncParseResolvers
} from '@kontent-ai/delivery-sdk'
import { asyncNodeParser } from '@kontent-ai/delivery-node-parser'
import type { AsyncNodeParser } from '@kontent-ai/delivery-node-parser'
import type { PortableTextTextBlock } from '../portable-text'

// TODO: Support passing these in as options to allow override as escape hatch?
const rootTag = '#document-fragment'
const textTag = '#text'
const paragraphTag = 'p'
const lineBreakTag = 'br'
const richTextEmptyValue = '<p><br></p>'

function richTextIsEmpty(value: string) {
  return !value || value === richTextEmptyValue
}

function createParseResolvers(
  blocks: PortableTextTextBlock[]
): IAsyncParseResolvers {
  return {
    elementResolverAsync: async (element) => {
      return
    },
    genericElementResolverAsync: async (element) => {
      const tag = element.tag.toLowerCase()

      // If the element is a direct descendant of the root tag then it is a "block", otherwise it is a "span"
      const isBlock = element.parentElement?.tag === rootTag
      const isText = tag === textTag
      const isLineBreak = tag === lineBreakTag

      if (isBlock) {
        if (isText) {
          // Text tags at block level would be whitespace that we don't need to parse
          return
        }

        // Add the block

        // TODO: Can use random `_key` or should it be deterministic?
        const key = blocks.length.toString()

        // TODO: Is paragraph the only "special case" for `style`? Is it always valid to use the `tag` otherwise?
        const style = tag === paragraphTag ? 'normal' : tag

        blocks.push({
          _key: key,
          _type: 'block',
          style,
          children: [],
          markDefs: []
        })
      } else {
        // This is a span so it can either be a descendant of the "current" block, or the "current" span

        const blockIndex = blocks.length - 1
        const block = blocks[blockIndex]

        const spanIndex = block.children.length - 1
        const span = spanIndex >= 0 ? block.children[spanIndex] : null
        const marks =
          span?._type === 'span' && Array.isArray(span.marks) ? span.marks : []

        const key = `${blockIndex}_${block.children.length}`

        let text = ''
        if (isText) {
          text = element.sourceElement.value ?? ''
        } else if (isLineBreak) {
          text = '\n'
        }

        const parentTag = element.parentElement?.tag

        if (span && parentTag && marks.includes(parentTag)) {
          // This span is a "child" of the "current" span

          if (isText || isLineBreak) {
            // Add text to the current span
            span.text += text
          } else {
            // Add a new span, but append the tag to the "current" span's marks
            block.children.push({
              _key: key,
              _type: 'span',
              text,
              marks: [...marks, tag]
            })
          }
        } else {
          // This span is not a "child" of the "current" span

          if (isText || isLineBreak) {
            if (span && !marks.length) {
              // We can append the text to the "current" span
              span.text += text
            } else {
              // Add a new span with no marks
              block.children.push({
                _key: key,
                _type: 'span',
                text,
                marks: []
              })
            }
          } else {
            // Add a new span using the tag as a mark
            block.children.push({
              _key: key,
              _type: 'span',
              text,
              marks: [tag]
            })
          }
        }
      }
    },
    urlResolverAsync: async (element, linkId, linkText, link?) => {
      return
    },
    imageResolverAsync: async (element, imageId, image) => {
      return
    },
    contentItemResolverAsync: async (
      element,
      linkedItemCodename,
      linkedItemIndex,
      linkedItem
    ) => {
      return
    }
  }
}

async function parseRichTextToPortableText(
  parser: AsyncNodeParser,
  element: Elements.RichTextElement,
  linkedItems?: IContentItem[]
): Promise<PortableTextTextBlock[]> {
  const html = element.value.trim()

  const blocks: PortableTextTextBlock[] = []

  if (richTextIsEmpty(html)) {
    return blocks
  }

  const resolvers = createParseResolvers(blocks)

  // The parseAsync method returns a result, but we don't need it
  await parser.parseAsync(html, element, resolvers, linkedItems ?? [])

  return blocks
}

interface RichTextPortableTextResolver {
  resolveRichText: (
    input: RichTextPortableTextResolverInput
  ) => Promise<PortableTextTextBlock[]>
}

interface RichTextPortableTextResolverInput {
  element: Elements.RichTextElement
  linkedItems?: IContentItem[]
}

function createPortableTextResolver(): RichTextPortableTextResolver {
  const parser = asyncNodeParser

  return {
    resolveRichText: async (input: RichTextPortableTextResolverInput) => {
      const result = await parseRichTextToPortableText(
        parser,
        input.element,
        input.linkedItems
      )

      return result
    }
  }
}

export { createPortableTextResolver }

export type { RichTextPortableTextResolver }
