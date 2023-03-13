import type { ReactNode } from 'react'
import { Meta } from './Meta'
import Alert from './Alert'
import Footer from './Footer'
import styles from './Layout.module.css'

interface LayoutProps {
  preview: boolean
  children: ReactNode
}

function Layout({ preview, children }: LayoutProps) {
  return (
    <>
      <Meta />
      <div className={styles.layout}>
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}

export { Layout }

export type { LayoutProps }
