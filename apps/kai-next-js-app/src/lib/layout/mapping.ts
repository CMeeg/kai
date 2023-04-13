import type { LayoutProps } from '~/components/Layout'

type LayoutContentProps = Pick<LayoutProps, 'preview'>

function createLayoutProps(preview: boolean): LayoutContentProps {
  return {
    preview
  }
}

export { createLayoutProps }

export type { LayoutContentProps }
