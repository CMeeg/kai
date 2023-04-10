import type { LayoutProps } from './Layout'

type LayoutContentProps = Pick<LayoutProps, 'preview'>

function createLayoutProps(preview: boolean): LayoutContentProps {
  return {
    preview
  }
}

export { createLayoutProps }

export type { LayoutContentProps }
