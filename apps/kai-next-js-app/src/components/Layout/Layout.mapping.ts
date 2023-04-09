import type { LayoutProps } from './Layout'

type LayoutContentProps = Pick<LayoutProps, 'preview'>

function createLayoutContentProps(preview: boolean): LayoutContentProps {
  return {
    preview
  }
}

export { createLayoutContentProps }

export type { LayoutContentProps }
