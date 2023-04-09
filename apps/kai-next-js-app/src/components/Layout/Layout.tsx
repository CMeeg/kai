import type { ReactNode } from 'react'
import { Alert } from './Alert'
import { Footer } from './Footer'

interface LayoutProps {
  preview: boolean
  children: ReactNode
}

function Layout({ preview, children }: LayoutProps) {
  return (
    <>
      <div className="min-h-screen">
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}

export { Layout }

export type { LayoutProps }
