// https://github.com/sanity-io/sanity/blob/25303f97027a2959adf008525549aaf92938ac27/packages/@sanity/types/src/portableText/types.ts#L6
interface PortableTextTextBlock<
  TChild = PortableTextSpan | PortableTextObject
> {
  _type: string
  _key: string
  children: TChild[]
  markDefs?: PortableTextObject[]
  listItem?: string
  style?: string
  level?: number
}

// https://github.com/sanity-io/sanity/blob/25303f97027a2959adf008525549aaf92938ac27/packages/@sanity/types/src/portableText/types.ts#L17
interface PortableTextObject {
  _type: string
  _key: string
  [other: string]: unknown
}

// https://github.com/sanity-io/sanity/blob/25303f97027a2959adf008525549aaf92938ac27/packages/@sanity/types/src/portableText/types.ts#L24
interface PortableTextSpan {
  _key: string
  _type: 'span'
  text: string
  marks?: string[]
}

export type { PortableTextTextBlock, PortableTextObject, PortableTextSpan }
