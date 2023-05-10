import type {
  Root as HastRoot,
  Element as HastElement,
  Text as HastText
} from 'hast'
import { visit, SKIP } from 'unist-util-visit'
import type { VisitorResult } from 'unist-util-visit'
import type { KastRoot } from './kast'

const allowedRichTextHtmlElements = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ol',
  'ul',
  'li',
  'figure',
  'img',
  'table',
  'tbody',
  'tr',
  'td',
  'object',
  'strong',
  'em',
  'sup',
  'sub',
  'code',
  'a',
  'br'
]

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

function transformElementNode(
  element: HastElement,
  index: number | null,
  parent: HastRoot | HastElement | null
): VisitorResult {
  if (!allowedRichTextHtmlElements.includes(element.tagName.toLowerCase())) {
    // This element is not allowed in Kontent Rich text fields so we will replace it with its children - see https://unifiedjs.com/learn/recipe/remove-node/

    return replaceElementWithChildren(element, index, parent)
  }

  // We don't need position
  delete element.position
}

function transformTextNode(text: HastText): VisitorResult {
  // We don't need position
  delete text.position
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
