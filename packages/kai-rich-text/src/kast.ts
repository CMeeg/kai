import type {
  Parent as UnistParent,
  Literal as UnistLiteral,
  Node as UnistNode
} from 'unist'

/*
See for reference:
https://kontent.ai/learn/reference/openapi/delivery-api/#section/HTML5-elements-allowed-in-rich-text
*/

const kastNodeType = {
  root: 'root',
  heading: 'heading',
  paragraph: 'paragraph',
  list: 'list',
  listItem: 'listItem',
  table: 'table',
  tableRow: 'tableRow',
  tableCell: 'tableCell',
  asset: 'asset',
  component: 'component',
  span: 'span',
  link: 'link',
  text: 'text'
} as const

type KastNodeType = keyof typeof kastNodeType

interface KastParent extends UnistParent {
  children: KastContent[]
}

type KastContent =
  | KastRootContent
  | KastHeadingContent
  | KastParagraph
  | KastList
  | KastListItem
  | KastTable
  | KastTableRow
  | KastTableCell
  | KastSpan
  | KastLink

interface KastRoot extends KastParent {
  type: typeof kastNodeType.root
  children: KastRootContent[]
}

type KastRootContent = KastRootContentMap[keyof KastRootContentMap]

interface KastRootContentMap {
  heading: KastHeading
  paragraph: KastParagraph
  list: KastList
  table: KastTable
  asset: KastAsset
  component: KastComponent
}

interface KastHeading extends KastParent {
  type: typeof kastNodeType.heading
  children: KastHeadingContent[]
  level: number
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
  span: KastSpan
  link: KastLink
  text: KastText
}

interface KastParagraph extends KastParent {
  type: typeof kastNodeType.paragraph
  children: KastParagraphContent[]
}

type KastParagraphContent =
  KastParagraphContentMap[keyof KastParagraphContentMap]

interface KastParagraphContentMap {
  span: KastSpan
  link: KastLink
  text: KastText
}

const kastListType = {
  ordered: 'ordered',
  unordered: 'unordered'
} as const

type KastListType = keyof typeof kastListType

interface KastList extends KastParent {
  type: typeof kastNodeType.list
  children: KastListContent[]
  listType: KastListType
}

type KastListContent = KastListContentMap[keyof KastListContentMap]

interface KastListContentMap {
  listItem: KastListItem
}

interface KastListItem extends KastParent {
  type: typeof kastNodeType.listItem
  children: KastListItemContent[]
}

type KastListItemContent = KastListItemContentMap[keyof KastListItemContentMap]

interface KastListItemContentMap {
  span: KastSpan
  link: KastLink
  text: KastText
}

interface KastTable extends KastParent {
  type: typeof kastNodeType.table
  children: KastTableContent[]
}

type KastTableContent = KastTableContentMap[keyof KastTableContentMap]

interface KastTableContentMap {
  tableRow: KastTableRow
}

interface KastTableRow extends KastParent {
  type: typeof kastNodeType.tableRow
  children: KastTableRowContent[]
}

type KastTableRowContent = KastTableRowContentMap[keyof KastTableRowContentMap]

interface KastTableRowContentMap {
  tableCell: KastTableCell
}

interface KastTableCell extends KastParent {
  type: typeof kastNodeType.tableCell
  children: KastTableCellContent[]
}

type KastTableCellContent =
  KastTableCellContentMap[keyof KastTableCellContentMap]

interface KastTableCellContentMap {
  span: KastSpan
  link: KastLink
  text: KastText
}

interface KastAsset extends UnistNode<KastAssetData> {
  type: typeof kastNodeType.asset
}

type KastAssetData = {
  assetId: string
  imageId: string
  url: string
  description: string
  width?: number | null
  height?: number | null
}

const kastComponentType = {
  component: 'component',
  item: 'item'
} as const

type KastComponentType = keyof typeof kastComponentType

interface KastComponent extends UnistNode<KastComponentData> {
  type: typeof kastNodeType.component
}

type KastComponentData = {
  type: KastComponentType
  codename: string
}

const kastMarkType = {
  strong: 'strong',
  emphasis: 'emphasis',
  superscript: 'superscript',
  subscript: 'subscript',
  code: 'code'
} as const

type KastMarkType = keyof typeof kastMarkType

interface KastSpan extends KastParent {
  type: typeof kastNodeType.span
  children: KastSpanContent[]
  marks: KastMarkType[]
}

type KastSpanContent = KastSpanContentMap[keyof KastSpanContentMap]

interface KastSpanContentMap {
  link: KastLink
  text: KastText
}

const kastLinkType = {
  internal: 'internal',
  external: 'external',
  email: 'email',
  phone: 'phone',
  asset: 'asset'
} as const

type KastLinkType = keyof typeof kastLinkType

interface KastLink extends KastParent {
  type: typeof kastNodeType.link
  children: KastLinkContent[]
  data: KastLinkData
}

type KastLinkContent = KastLinkContentMap[keyof KastLinkContentMap]

interface KastLinkContentMap {
  span: KastSpan
  text: KastText
}

type KastLinkData =
  | {
      type: typeof kastLinkType.internal
      itemId: string
    }
  | {
      type: typeof kastLinkType.external
      url: string
      title: string
      openInNewWindow: boolean
    }
  | {
      type: typeof kastLinkType.email
      email: string
      subject: string
    }
  | {
      type: typeof kastLinkType.phone
      phone: string
    }
  | {
      type: typeof kastLinkType.asset
      assetId: string
      url: string
    }

interface KastText extends KastLiteral {
  type: typeof kastNodeType.text
}

interface KastLiteral extends UnistLiteral {
  value: string
}

export {
  kastNodeType,
  kastListType,
  kastComponentType,
  kastMarkType,
  kastLinkType
}

export type {
  KastNodeType,
  KastParent,
  KastContent,
  KastRoot,
  KastRootContent,
  KastRootContentMap,
  KastHeading,
  KastHeadingContent,
  KastHeadingContentMap,
  KastParagraph,
  KastParagraphContent,
  KastParagraphContentMap,
  KastListType,
  KastList,
  KastListContent,
  KastListContentMap,
  KastListItem,
  KastListItemContent,
  KastListItemContentMap,
  KastTable,
  KastTableContent,
  KastTableContentMap,
  KastTableRow,
  KastTableRowContent,
  KastTableRowContentMap,
  KastTableCell,
  KastTableCellContent,
  KastTableCellContentMap,
  KastAsset,
  KastAssetData,
  KastComponentType,
  KastComponent,
  KastComponentData,
  KastSpan,
  KastSpanContent,
  KastSpanContentMap,
  KastMarkType,
  KastLinkType,
  KastLink,
  KastLinkContent,
  KastLinkContentMap,
  KastLinkData,
  KastText,
  KastLiteral
}
