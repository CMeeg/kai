import type {
  Root as HastRoot,
  Element as HastElement,
  Text as HastText
} from 'hast'
import { visit, SKIP } from 'unist-util-visit'
import type { VisitorResult } from 'unist-util-visit'
import { kastNodeType } from '~/kast'
import type { KastHeading, KastRoot } from '~/kast'

const htmlTagName = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  ol: 'ol',
  ul: 'ul',
  li: 'li',
  figure: 'figure',
  img: 'img',
  table: 'table',
  tbody: 'tbody',
  tr: 'tr',
  td: 'td',
  object: 'object',
  strong: 'strong',
  em: 'em',
  sup: 'sup',
  sub: 'sub',
  code: 'code',
  a: 'a',
  br: 'br'
} as const

type HtmlTagName = keyof typeof htmlTagName

function isAllowedHtmlTag(tagName: string): tagName is HtmlTagName {
  return !!Object.values(htmlTagName).find((htmlTag) => tagName === htmlTag)
}

const hastNodeType = {
  comment: 'comment',
  doctype: 'doctype',
  element: 'element',
  root: 'root',
  text: 'text'
} as const

function replaceElementWithChildren(
  element: HastElement,
  index: number | null,
  parent: HastRoot | HastElement | null
): VisitorResult {
  if (index !== null && parent !== null) {
    parent.children.splice(index, 1, ...element.children)

    // Skip this node and continue traversing
    return [SKIP, index]
  }
}

function removeNode(
  index: number | null,
  parent: HastRoot | HastElement | null
): VisitorResult {
  if (index !== null && parent != null) {
    parent.children.splice(index, 1)

    // Do not traverse `node`, continue at the node *now* at `index`.
    return [SKIP, index]
  }
}

function transformRootNode(root: HastRoot): VisitorResult {
  // We don't need position or data
  delete root.position
  delete root.data
}

function transformHeadingElement(element: HastElement) {
  const { tagName } = element

  const level = parseInt(tagName.substring(1))

  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const heading = element as unknown as KastHeading
  heading.type = kastNodeType.heading
  heading.level = level
}

const elementTransformer: Partial<
  Record<HtmlTagName, (element: HastElement) => void>
> = {
  [htmlTagName.h1]: transformHeadingElement,
  [htmlTagName.h2]: transformHeadingElement,
  [htmlTagName.h3]: transformHeadingElement,
  [htmlTagName.h4]: transformHeadingElement,
  [htmlTagName.h5]: transformHeadingElement,
  [htmlTagName.h6]: transformHeadingElement
}

function transformElementNode(
  element: HastElement,
  index: number | null,
  parent: HastRoot | HastElement | null
): VisitorResult {
  if (!isAllowedHtmlTag(element.tagName)) {
    // This element is not allowed in Kontent Rich text fields so we will replace it with its children - see https://unifiedjs.com/learn/recipe/remove-node/

    return replaceElementWithChildren(element, index, parent)
  }

  // We don't need position
  delete element.position

  // Transform based on the element's tagName
  const transformer = elementTransformer[element.tagName]
  if (transformer) {
    transformer(element)
  }
}

function transformTextNode(text: HastText): VisitorResult {
  // We don't need position or data
  delete text.position
  delete text.data
}

function hastToKast() {
  // TODO: Validate nodes are valid (or remove those that aren't)

  return (tree: HastRoot) => {
    visit(tree, (node, index, parent) => {
      if (node.type === hastNodeType.root) {
        return transformRootNode(node)
      }

      if (node.type === hastNodeType.element) {
        return transformElementNode(node, index, parent)
      }

      if (node.type === hastNodeType.text) {
        return transformTextNode(node)
      }

      // If it's not a root, element or text node then we don't need it
      return removeNode(index, parent)
    })

    return tree as unknown as KastRoot
  }
}

export { hastToKast }
