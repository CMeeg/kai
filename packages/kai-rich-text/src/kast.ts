import type { Parent as UnistParent, Literal as UnistLiteral } from 'unist'

/*
https://kontent.ai/learn/reference/openapi/delivery-api/#section/HTML5-elements-allowed-in-rich-text

* Root
* Blocks
  * Heading
  * Paragraph
  * List, ListItem
  * Asset
  * Table, TableBody, TableRow, TableCell
  * ContentItem
  * Component
* Spans
  * Strong (Span with Marks?)
  * Emphasis (Span with Marks?)
  * Superscript (Span with Marks?)
  * Subscript (Span with Marks?)
  * Code
  * Link
  * LineBreak (\n in Text?)
* Text
*/

const kastNodeType = {
  root: 'root',
  heading: 'heading',
  text: 'text'
} as const

interface KastParent extends UnistParent {
  children: KastContent[]
}

type KastContent = KastRootContent | KastHeadingContent

interface KastRoot extends KastParent {
  type: typeof kastNodeType.root
  children: KastRootContent[]
}

type KastRootContent = KastRootContentMap[keyof KastRootContentMap]

interface KastRootContentMap {
  heading: KastHeading
}

interface KastHeading extends KastParent {
  // TODO: Does this work, or do I need to use the literal type?
  type: typeof kastNodeType.heading
  level: number
  children: KastHeadingContent[]
}

type KastHeadingContent = KastHeadingContentMap[keyof KastHeadingContentMap]

/**
 * TODO: This comment is interesting, and the capability is worth preserving for custom elements?
 * This map registers all node types that may be used as content in an element.
 *
 * These types are accepted inside `element` nodes.
 *
 * This interface can be augmented to register custom node types.
 *
 * @example
 * declare module 'kast' {
 *   interface ElementContentMap {
 *     custom: Custom;
 *   }
 * }
 */
interface KastHeadingContentMap {
  text: KastText
}

interface KastText extends KastLiteral {
  type: typeof kastNodeType.text
}

interface KastLiteral extends UnistLiteral {
  value: string
}

export { kastNodeType }

export type {
  KastParent,
  KastContent,
  KastRoot,
  KastRootContent,
  KastRootContentMap,
  KastHeading,
  KastHeadingContent,
  KastHeadingContentMap,
  KastText,
  KastLiteral
}
